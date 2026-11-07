---
title: From node to machine room
summary: Nodes, blades, frames, cabinets, three floors, and what the counts, the power and the HPL run tell you.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 3
tags: architecture, datacentre
---

## The hierarchy

| Level | Holds | Count |
| --- | --- | --- |
| Socket | one LX2, 304 cores | 45,360 in the HPL run |
| Node | 2 sockets, 64 GB HBM, 512 GB DDR | 22,680 in the HPL run |
| Blade | 8 nodes, linked by PCIe 5.0 | |
| Frame | 16 blades, 128 nodes | |
| Cabinet | 2 frames, 256 nodes, 512 sockets | about 90 |

90 cabinets give 23,040 node slots. The HPL run used 22,680, which is 98.4% of them, and 22,680 × 608 is exactly the 13,789,440 cores on the list. NSCS's first paper describes 20,480 nodes; the team that trained an interatomic potential model also calls 20,480 "the full machine", so the system probably grew between spring and the June list. Lockwood counts 184 compute frames on the floor plan shown at ISC, which would be 23,552 nodes. The safe statement is "about 90 cabinets, a bit over 22,000 nodes".

A node is 121 TFlop/s of FP64, a cabinet about 31 PFlop/s. That cabinet figure is the same order as a full HPE Cray EX cabinet of MI300A: dense, liquid-cooled, and built for it.

## Three floors

The building is stacked by function:

| Floor | |
| --- | --- |
| 1 | cooling plant |
| 2 | compute, rows of 14 compute cabinets and 6 network cabinets |
| 3 | storage, 67 cabinets, 428 storage nodes |

Compute and storage are liquid-cooled. NSCS describes the storage as China's largest liquid-cooled storage deployment.

## Power

42.22 MW during HPL. Some arithmetic, all mine:

| | |
| --- | --- |
| LX2 sockets alone | 45,360 × 690 W ≈ 31.3 MW |
| Everything else in the measurement | ≈ 10.9 MW |
| Per node, all in | ≈ 1.86 kW |

So about three quarters of the measured power is in the CPUs. The rest covers DDR, NICs, switches, power conversion and pumps, depending on what the measurement boundary includes.

At 52.07 GFlop/s per W, LineShine sits behind El Capitan (60.94) and far behind the Green500 leader KAIROS (73.28). A Japanese report places it 50th on the Green500. CPU-only is not the efficient way to an exaflop; it is the available one.

## The HPL run

The run took 16,181 s, about 4.5 hours. HPL performs about $\tfrac{2}{3}N^3$ flops, which lets you estimate the problem size:

$$
\tfrac{2}{3}N^3 \approx 2.1984 \times 10^{18} \times 16{,}181
\quad\Rightarrow\quad N \approx 3.8 \times 10^{7}
$$

A matrix of that order in double precision takes $8N^2 \approx 11.4$ PB. The 22,680 nodes have $22{,}680 \times 512 \ \text{GB} \approx 11.6$ PB of DDR. The matrix fills about 98% of the DDR, which is how HPL is meant to be run. NSCS has not published N, so treat this as an estimate.

It also tells you that HPL lived in DDR, not HBM, with the panels and trailing updates streamed through the HBM. At 80% of peak, the SDMA engines and the 28.5 MB L2s did their job.
