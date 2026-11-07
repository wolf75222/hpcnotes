---
title: Benchmarks, beyond HPL
summary: HPL, HPCG, HPL-MxP and Green500 side by side with El Capitan, Frontier, Aurora and Fugaku, and what each ratio says about the design.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 6
tags: top500, benchmarks
---

## The June 2026 numbers

| System | HPL | HPCG | HPL-MxP | MxP / HPL |
| --- | --- | --- | --- | --- |
| LineShine | 2.198 EF | 22.00 PF | 7.92 EF | 3.6× |
| El Capitan | 1.809 EF | 17.41 PF | 16.7 EF | 9.2× |
| Frontier | 1.353 EF | 14.05 PF | 11.4 EF | 8.4× |
| Aurora | 1.012 EF | 5.61 PF | 11.6 EF | 11.5× |
| Fugaku | 0.442 EF | 16.00 PF | | |

## HPL: 80% of peak

2,198.4 of 2,735.8 PFlop/s is 80.4%. The Next Platform notes that the three US exascale systems sit at 50 to 65% of their peaks, and Fugaku reached 82%. CPUs with a large L2 and a matrix unit per core are easier to keep busy on dense LU than GPUs, where the panel factorisation and the communication have to hide behind very fast updates.

## HPCG: first, but still under 1%

HPCG solves a sparse system with conjugate gradient. It is bound by memory bandwidth and latency, which makes it a better proxy for many real codes than HPL.

LineShine's 22.00 PF is 0.80% of its peak. That is typical of every large machine: the bandwidth just is not there for a sparse solver to use the flops. What matters is the absolute number, and LineShine leads El Capitan by 26%. That fits the memory page: 45,360 sockets × 3.6 TB/s measured is about 163 PB/s of HBM bandwidth across the machine (my arithmetic).

Fugaku, six years old, is still third on HPCG with 16 PF. A machine built around bandwidth ages well on this list.

## HPL-MxP: where GPUs pull ahead

HPL-MxP solves the same system in low precision and refines the answer to FP64 accuracy. It rewards hardware with a high ratio of low-precision to FP64 throughput.

LX2's FP16 peak is 4× its FP64 peak. Across 45,360 sockets that is 10.9 EFlop/s of FP16 (my arithmetic). 7.92 EF is 73% of it: LineShine runs MxP close to its ceiling, and the ceiling is low. GPU tensor cores have FP16-to-FP64 ratios of 16× and more, which is why El Capitan gets 9.2× and Aurora 11.5× over their HPL.

The same ratio shows up in AI training. The Earth-observation team sustained 1.54 EFlop/s in BF16 end to end on 20,480 nodes, 15.7% of a BF16 peak of 480 TFlop/s per node. Respectable for a CPU, but El Capitan alone has a larger BF16 peak.

## Green500: 52 GFlop/s per W

52.07 GFlop/s per W, against 60.94 for El Capitan and 73.28 for the leader, KAIROS. One report puts LineShine 50th on the Green500. The page on the machine room breaks down where the 42 MW goes.

## What the four numbers say together

- HPL: the matrix engines work, and the design is easy to keep busy.
- HPCG: lots of HBM, spread over a lot of sockets, beats everybody on bandwidth-bound work.
- HPL-MxP: no tensor cores, so low precision buys 4×, not 10×.
- Green500: the CPU route costs about 17% more energy per FP64 flop than El Capitan.

Dongarra's own comment after visiting: an impressive system, and no single benchmark captures energy efficiency, software maturity or usefulness for research.
