---
title: The LX2 core, and 128 flops a cycle
summary: Armv9 with SVE2 and SME. Where the FP64 peak comes from, why the clock is 1.55 GHz, and what code can actually reach it.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 1
tags: architecture, arm, simd
---

LX2 is an Armv9 server CPU. NSCS calls the platform LingKun and has not named the designer; most analysts point at Huawei's HiSilicon, and the software stack (Kunpeng libraries, Hyper MPI) points the same way.

## The package

Two compute dies, four clusters per die. Chips and Cheese reports 40 physical cores per cluster with two fused off, which leaves 38 active, 152 per die and 304 per socket. Fusing cores is the usual yield trick on a big die, and it fits a chip that is probably built on a domestic 7 nm class process (that last part is speculation from The Next Platform).

| Per socket | |
| --- | --- |
| Dies | 2 |
| Clusters | 8, 38 active cores each (40 physical) |
| Cores | 304 at 1.55 GHz |
| L1 | 32 KB instruction + 32 KB data per core |
| L2 | 28.5 MB per cluster, 228 MB per socket |
| L3 | none reported |
| Power | about 690 W |

The L2 is large: 28.5 MB for 38 cores is 750 KB per core, shared inside the cluster. There is no L3 in any source. The on-package HBM plays that role, one stack per cluster.

![LX2 package: two dies of four 38-core clusters, each with its L2 and HBM stack, an integrated NIC, and DDR off package](/media/lineshine-lx2.svg)

## Where 60.3 TFlop/s comes from

The FP64 peak of a socket is 60.3 TFlop/s. Divide by cores and clock:

$$
\frac{60.3 \times 10^{12}}{304 \times 1.55 \times 10^{9}} = 128 \ \text{FP64 flop per cycle per core}
$$

A 512-bit SVE unit holds 8 doubles. With two FMA pipes that is 2 × 8 × 2 = 32 flops per cycle, a quarter of the peak. The rest comes from SME, the Scalable Matrix Extension. Each core has one 512-bit SME engine, and its `FMOPA` instruction takes two vectors of 8 doubles and adds their outer product into an 8 × 8 tile of accumulators called ZA. That is 64 FMAs, or 128 flops, every cycle.

![An SME FMOPA: a column of 8 doubles times a row of 8 doubles accumulates into an 8 by 8 tile](/media/lineshine-sme-fmopa.svg)

The other precisions scale as you would expect from a 512-bit datapath:

| Precision | Per socket | Per core per cycle |
| --- | --- | --- |
| FP64 | 60.3 TFlop/s | 128 |
| FP32 | 120.6 TFlop/s | 256 |
| BF16, FP16 | 240 TFlop/s | 512 |
| INT8 | 960 TOp/s | 2,048 |

The per-cycle column is mine: peak divided by 304 × 1.55 GHz.

## Why so slow a clock

1.55 GHz is low for a 2026 server core. But a socket at 690 W running 304 matrix engines spends its power on the datapath, not on frequency. Per watt at the socket, the FP64 peak is 60.3 TFlop/s / 690 W ≈ 87 GFlop/s per W, which is in the range of a GPU. The clock is the price of that.

## What reaches the peak, and what does not

SME only pays off on code shaped like a matrix product: dense GEMM, the panels of an LU or Cholesky factorisation, batched small matrices, convolutions written as GEMM, attention. HPL is exactly that, which is why LineShine posts 80% of peak.

Code that the compiler vectorises with SVE, a loop over arrays with no reuse, gets at most 32 of the 128 flops per cycle. And most such code is memory-bound anyway, so it never gets near SVE's limit either. The memory page has the numbers.

Writing SME by hand is unusual. The arXiv teams that trained models on LineShine wrote two GEMM micro-kernels, 64 × K by K × 16 and 16 × K by K × 64, and picked one at run time from the matrix shape. The blocking depth K is derived from the L2 size. Everything else calls a BLAS that already knows SME, which on this machine means Huawei's Kunpeng Math Library.

## Compared with other CPU-only number ones

| | Fugaku A64FX (2020) | LX2 (2026) |
| --- | --- | --- |
| ISA | Armv8.2 + SVE 512 | Armv9 + SVE2 + SME 512 |
| Cores per socket | 48 (+4 assistant) | 304 |
| FP64 per core per cycle | 32 | 128 |
| FP64 per socket | 3.4 TFlop/s | 60.3 TFlop/s |
| On-package memory | 32 GB HBM2, 1 TB/s | 32 GB HBM, 4 TB/s |
| Second memory tier | none | 256 GB DDR |

The A64FX numbers are from Fujitsu's public specifications. Fugaku also had no accelerator, but its flops came from SVE alone. LX2 is what that design looks like with a matrix engine per core and six times the cores.
