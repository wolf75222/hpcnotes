---
title: LineShine, an exaflop without GPUs
summary: The June 2026 TOP500 number one, taken apart: the LX2 chip, its matrix units, two memory tiers, the LingQi network, the software, and what the benchmarks really say.
date: 2026-11-07
author: hpcnotes
kind: note
tags: architecture, top500, arm
---

LineShine took first place on the TOP500 in June 2026. It runs HPL at 2.198 EFlop/s, 21.5% ahead of El Capitan, and there is no GPU anywhere in it. Every flop comes from an Armv9 CPU called LX2, 45,360 of them, each with a matrix engine inside every core. The National Supercomputing Center in Shenzhen (NSCS) runs it; the Shenzhen Cloud Computing Center built it.

The last Chinese number one was Sunway TaihuLight in 2017. China then stopped submitting, and the usual reading is that US export controls closed the door on high-end GPUs. LineShine is what you build when the accelerator is off the table: put the accelerator in the core.

NSCS calls the approach "online acceleration": scalar, vector and matrix work, communication and I/O all run in one CPU, one memory hierarchy and one software stack. Their own paper is careful to say it does not replace GPU machines for the largest dense AI training.

![LineShine on the compute floor of the National Supercomputing Center in Shenzhen. NSCS slide, via The Next Platform.](/media/lineshine-photo.jpg)

## The machine on one page

| | |
| --- | --- |
| HPL (Rmax) | 2,198.4 PFlop/s, 80.4% of peak |
| Peak FP64 (Rpeak) | 2,735.8 PFlop/s |
| HPCG | 22.00 PFlop/s, first in the world |
| HPL-MxP | 7.92 EFlop/s, fourth |
| Power during HPL | 42.22 MW, 52.07 GFlop/s per W |
| Nodes in the HPL run | 22,680, two LX2 each |
| Cores | 13,789,440 Armv9 cores at 1.55 GHz |
| Per socket | 304 cores, 32 GB HBM, 256 GB DDR, one 800 Gb/s NIC |
| Network | LingQi, dual-plane four-level fat tree, 1.6 Tb/s per node |
| Storage | about 200 PB, 10 TB/s fast tier |
| OS | Kylin Linux |

## How these pages are organised

Start with the chip, because everything else follows from it. The core page explains where the 128 flops per cycle come from. The memory page is the one to read if your code is a stencil or a sparse solver. The benchmark page compares LineShine with El Capitan, Frontier and Fugaku on more than HPL.

## On the sources

Almost everything public comes from five places: the TOP500 entry, an NSCS paper and press release, Jack Dongarra's report after his visit (ICL-UT-26-01), two arXiv papers by teams that ran on the full machine, and Glenn Lockwood's reconstruction from the ISC talk slides. Trade press fills the gaps. The sources disagree on a few points: node count, HBM capacity, the NIC layout. Each page flags those, and every number I derived myself is marked as such.

Sources: [TOP500 June 2026](https://top500.org/lists/top500/2026/06/), [TOP500 news](https://top500.org/news/lineshine-debuts-no-1-top500-enters-new-global-exascale-era/), [NSCS release](https://www.newswise.com/articles/no-1-on-top500-and-hpcg-lineshine-supercomputer-introduces-a-new-architecture-for-hpc-ai-converged-scientific-computing), [Glenn Lockwood, LX2](https://glennklockwood.com/garden/processors/lx2), [Glenn Lockwood, LineShine](https://glennklockwood.com/garden/systems/LineShine), [arXiv:2605.08633](https://arxiv.org/abs/2605.08633), [arXiv:2604.15821](https://arxiv.org/abs/2604.15821), [Chips and Cheese](https://chipsandcheese.com/p/top500-at-isc26-we-have-a-new-number), [The Next Platform](https://www.nextplatform.com/hpc/2026/06/25/a-deep-dive-on-chinas-lineshine-all-cpu-exaflops-class-supercomputer/5262439), [ServeTheHome](https://www.servethehome.com/?p=101404), [HPCwire](https://www.hpcwire.com/2026/06/25/inside-lineshine-the-new-chinese-supercomputer-sitting-atop-the-top500/).
