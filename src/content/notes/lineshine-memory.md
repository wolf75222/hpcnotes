---
title: Memory, two tiers and sixteen NUMA domains
summary: 32 GB of HBM and 256 GB of DDR per socket, measured bandwidths between every pair of domains, SDMA engines, and the roofline that follows.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 2
tags: architecture, memory, numa
---

Each LX2 socket has two kinds of memory. On the package, eight stacks of 4 GB, one per cluster: 32 GB at 4 TB/s peak. Off the package, 256 GB of DDR, 128 GB per die. Most sources say DDR5; NSCS's own papers leave the generation out, and Chips and Cheese wonders whether the stacks are standard HBM or a domestic design.

The Next Platform first read the package photo as sixteen stacks and 64 GB per socket. 64 GB is the per-node figure (two sockets), and Dongarra's report, the arXiv papers and Lockwood all agree on 32 GB per socket.

## Sixteen NUMA domains per socket

The arXiv paper on Earth-observation training lists 16 NUMA domains per socket: on each die, four cluster-local HBM domains and four DDR domains. With two sockets, a node is 32 NUMA domains. `numactl --hardware` on this machine is a long read.

Here is what a cluster measures when it reads from each of them:

![Measured bandwidth from one cluster: local HBM 450 GB/s, same-die HBM 230, other-die HBM 170, other socket 45; local DDR 125, other die 110, other socket 45](/media/lineshine-numa.svg)

| From one cluster to | HBM | DDR |
| --- | --- | --- |
| its own domain | 450 GB/s | 125 GB/s (its die) |
| another cluster, same die | 230 GB/s | |
| the other die | 170 GB/s | 110 GB/s |
| the other socket | 45 GB/s | 45 GB/s |

Three things stand out. Local HBM is ten times the cross-socket link, so a rank must live next to its data. Remote HBM on the same die is half the local rate, so even inside a die, placement matters. And the other socket is no faster for HBM than for DDR: at 45 GB/s, the inter-socket link is the bottleneck, whatever sits on the other side.

The practical rule follows: one MPI rank per cluster, pinned, 16 ranks per node. That is exactly what both arXiv teams did.

## The roofline

Per socket, 8 stacks at 450 GB/s give 3.6 TB/s measured from HBM. Two dies at 125 GB/s give 0.25 TB/s from DDR.

![Roofline of one LX2 socket: FP64 peak 60.3 TFlop/s, HBM roof 3.6 TB/s with a ridge near 17 flop per byte, DDR roof 0.25 TB/s with a ridge near 241](/media/lineshine-roofline.svg)

The ridge points, where a kernel stops being bound by memory:

$$
I_{\text{HBM}} = \frac{60.3 \ \text{TFlop/s}}{3.6 \ \text{TB/s}} \approx 17 \ \text{flop/byte}
\qquad
I_{\text{DDR}} = \frac{60.3}{0.25} \approx 241 \ \text{flop/byte}
$$

A 7-point stencil in double precision does about 0.5 flop per byte. From HBM that caps it at 1.8 TFlop/s per socket, 3% of peak. From DDR, 0.13 TFlop/s. A sparse matrix-vector product, around 0.1 flop per byte, does worse. Only blocked dense linear algebra and well-tiled tensor contractions clear 17 flop per byte.

For comparison, a Frontier MI250X has 47.9 TFlop/s and 3.2 TB/s: a ridge of 15. In bytes per flop, LineShine's HBM tier is balanced like a GPU, not like a CPU.

## Flat, cache, and SDMA

The HBM can be configured flat, as separately addressable memory, or as a cache in front of the DDR, much like MCDRAM on Knights Landing. In flat mode something has to move data between the tiers, and each die has a dedicated SDMA engine for that.

The teams that trained on the full machine used flat mode and moved data explicitly:

- For a GEMM: copy the inputs DDR → HBM in bulk, compute in HBM, write the result back.
- Double-buffered: SDMA prefetches the next layer while the cores compute the current one.
- Copies over 1 MB go to SDMA. That was up to 1.4× faster than letting the cores copy, because the cores are busy.
- Placement by phase: in the forward pass only the attention outputs stay in HBM; in the backward pass almost everything does, and parameter gradients are pushed out to DDR while communication runs.

What placement buys, operator by operator. The first letter is where the weights live, the second where the activations live; attention backward goes from 38 ms in DDR to 19.5 ms in HBM.

![Forward and backward latency of linear, attention and RMSNorm layers with weights and activations in DDR or HBM (DD, HD, DH, HH). Zhang et al., arXiv:2605.08633, CC BY-NC-SA 4.0, figure 4.](/media/lineshine-arxiv-hbm-ddr-latency.png)

With 32 GB of fast memory against 256 GB of slow, this is the main job of anyone porting code to LineShine. It is the same problem GPU programmers have with host memory, except that here it happens inside one chip.
