---
title: LingQi, the network
summary: Two planes, four rails, a four-level fat tree with one optical hop, 1.6 Tb/s per node, and what that means for a halo exchange.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 4
tags: architecture, network, mpi
---

LingQi (LQLink in the arXiv papers) is a Chinese-designed interconnect. The public facts:

| | |
| --- | --- |
| Topology | dual-plane, multi-rail fat tree, four levels |
| Per node | 1.6 Tb/s |
| Single-hop latency | 1.07 µs |
| Bisection | more than 3.5 Pb/s |
| Scale | claimed up to 2 million ports, over 100,000 nodes |
| Software interface | UCX |

## Planes, rails and NICs

Two sources describe the node side differently. Lockwood and ServeTheHome put one 800 Gb/s NIC inside each LX2, so two per node, one per plane. The NSCS release says "eight network interfaces" per node and a "dual-plane, four-rail" fat tree.

Both can be true. Eight interfaces of 200 Gb/s, four rails on each of two planes, also make 1.6 Tb/s. An 800G NIC built as four 200G ports would look like one NIC to Lockwood and four interfaces to NSCS. That reconciliation is mine; nobody has published the NIC.

![LingQi as NSCS drew it: L1 switches on the 16 compute blades of each of 184 compute frames, 8 L2 switch blades per frame, 16 L3 and 6 L4 switch blades in each of 32 network frames. Right panel: 22K+ nodes, 200K ports, 4-level fat tree, bisection at least 3.5 Pb/s, 1.07 µs per hop, one optical layer, credit-based lossless flow control, dual plane and multi-rail. NSCS slide at ISC 2026, photographed for The Next Platform.](/media/lineshine-slide-lingqi.jpg)

## The four levels

Lockwood reconstructed the tree from the ISC slides. Read these as an informed estimate:

| Level | Switches | Links |
| --- | --- | --- |
| L1, host leaf | 2,944 | copper to the nodes, 8 × 100G up |
| L2, frame spine | 1,472 | 16 down, 8 optical up, 2:1 taper |
| L3, core leaf | 512 | optical down, copper up |
| L4, core spine | 192 | copper |

2,944 is exactly the number of blades in 23,552 nodes, so one leaf switch per blade, which matches Lockwood's node count. Only the L2 to L3 hop is optical, so copper does everything inside a frame and inside the core. The switch ASICs look like 32 ports of 100G. The tree tapers: 2:1 at L2, about 7.7:1 overall by Lockwood's estimate.

## What 1.6 Tb/s buys

200 GB/s per node against 120.6 TFlop/s of FP64 is 0.0017 bytes per flop. Within a node, a cluster reads its HBM at 450 GB/s, more than twice what the whole node can send to the network.

Take a 3D stencil with one rank per cluster, 16 ranks per node, each owning a $256^3$ block of doubles. A one-cell halo is $6 \times 256^2 \times 8 \ \text{B} \approx 3.1$ MB per rank per step, about 50 MB per node. At 200 GB/s that is 0.25 ms. Updating the block reads and writes about $256^3 \times 16 \ \text{B} \approx 270$ MB, which takes about 0.6 ms at 450 GB/s from the cluster's HBM. Same order of magnitude: the halo can hide behind the update if the code overlaps them, and it cannot if it does not. The taper starts to matter for all-to-all patterns such as FFTs and MoE dispatch, which is why one arXiv team compressed its MoE all-to-all to FP16 and halved the volume.

## InfiniBand or Ethernet

HPCwire reports credit-based flow control, an InfiniBand trait. The Next Platform suspects an Ethernet variant. The software sees UCX either way, so Open MPI and Huawei's Hyper MPI run unchanged.
