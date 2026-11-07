---
title: Software, and making SME useful
summary: Kylin, Lclang, KML, Hyper MPI, UCX, and the tricks the first full-machine users needed: core partitioning, an async MPI runtime, SDMA pipelines.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 5
tags: software, mpi, arm
---

## The stack

| Layer | On LineShine |
| --- | --- |
| OS | Kylin Linux |
| Compiler | Lclang (NSCS, LLVM-based by its name), GCC |
| BLAS | Kunpeng Math Library (KML 25.2.1), OpenBLAS |
| MPI | Hyper MPI (Huawei), Open MPI 4.1.6 |
| Transport | UCX over LingQi |
| NSCS libraries | STAR-Lance (compute), STAR-Flux (communication), STAR-Helix (HPC-AI workflows) |
| ML | PyTorch 2.10 on the CPU backend |

The versions come from the arXiv paper on interatomic potentials. NSCS has described the STAR libraries only by their role.

## One rank per cluster

Both teams that ran on the full machine used the same layout: 16 MPI ranks per node, one per 38-core cluster, with OpenMP inside. It follows from the memory page: a rank that stays on its cluster reads 450 GB/s from its own HBM stack, and one that strays gets half or less.

Inside the 38 cores, the interatomic potential team split the work:

| Cores | Job |
| --- | --- |
| 32 | OpenMP compute |
| 5 | MPI communication thread pool |
| 1 | operating system |

The Earth-observation team reports 37 cores per cluster available to the application, one left to the OS.

## Rebuilding CUDA streams on a CPU

On a GPU, PyTorch overlaps communication and compute through CUDA streams. The CPU backend has no such thing: a collective blocks the thread that calls it. Both teams wrote their way around that.

- The interatomic potential team built an asynchronous MPI runtime. Collectives are handed to the 5 communication cores as task graphs (taskflow), so the 32 compute cores never wait.
- The Earth-observation team added a dedicated launch thread. PyTorch's dispatch overhead fell from 24.2% of step time to 1.9%.

## GEMM on SME

The Earth-observation team wrote two SME micro-kernels, 64 × K by K × 16 and 16 × K by K × 64, chosen at run time from the matrix shape. K comes from the L2 capacity, so a panel stays in the 28.5 MB of the cluster. The streamed operand is prefetched into HBM; partial sums in FP32 also stay in HBM when K is large. Bias and scaling are fused into the write-back. Single-node step time on their 6-billion-parameter model went from 51.3 s to 5.0 s, a 10.3× gain, once all of this was in place.

## Start-up at scale

One number every user of a big machine should look at: on the full system, MPI initialisation took 923.5 s and Python imports plus HBM and PyTorch initialisation another 531.8 s. Twenty-four minutes before the first step. On a 22,000-node job, start-up is part of the cost of a run.

## Porting checklist

What these papers suggest, if you bring a code to LineShine:

1. One rank per cluster, pinned. `numactl` and your MPI's binding options are not optional.
2. Find your GEMMs and make sure they hit KML or an SME kernel. That is where 75% of the FP64 peak lives.
3. Decide what lives in HBM. 4 GB per cluster is small; plan the tiers explicitly or use cache mode and measure.
4. Hand bulk copies to SDMA and overlap them with compute.
5. Keep cores for communication if your MPI does not progress on its own.
