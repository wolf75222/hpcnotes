---
title: What runs on it
summary: Turbulence at 16.5 trillion grid points, a whole-brain spiking model, drug screening over 10^13 molecules, and two exascale training runs on CPUs.
date: 2026-11-07
author: hpcnotes
parent: lineshine-architecture
order: 7
tags: applications, ai
---

NSCS launched LineShine with four flagship applications. Two arXiv papers add the details of AI training at full scale.

## Simulation

| Code | Field | Scale reported |
| --- | --- | --- |
| PowerLLEL | turbulence, direct numerical simulation | 16.5 trillion grid points at friction Reynolds number ≈ 21,000, heading to ≈ 43,000 |
| CerebroSim | spiking brain model | 86 billion neurons, 100 trillion synapses |
| GLARE-Exa | drug design | 10^13 synthesizable compounds searched in 22.6 hours |

16.5 trillion grid points of one velocity component in double precision is 132 TB, which fits in the machine's DDR about 88 times over (my arithmetic). DNS codes like PowerLLEL are FFT- and stencil-heavy, which makes them a good test of the HBM tier and of the network's all-to-all.

86 billion neurons and 100 trillion synapses are the commonly cited figures for a human brain. At even a few bytes per synapse, that is hundreds of terabytes of state, a natural fit for 11.6 PB of DDR.

## AI training on CPUs

| Model | Task | Scale | Result |
| --- | --- | --- | --- |
| D2AR, 6.3 B parameters | Earth-observation compression | 20,480 nodes | 1.54 EFlop/s BF16 sustained, 2.16 peak, 15.7% MFU |
| MatRIS-MoE | universal interatomic potential | full machine | 1.2 EFlop/s FP32 weak scaling at 90.3% efficiency |

D2AR compresses satellite archives by 100 to 10,000 times. The team's optimisations, from SME kernels to SDMA pipelines, are on the software page.

![Weak scaling of D2AR from 4 to 20,480 nodes: the 6 B model reaches 1,543 PFlop/s at 76% efficiency. Zhang et al., arXiv:2605.08633, CC BY-NC-SA 4.0, figure 7.](/media/lineshine-arxiv-d2ar-scaling.png)

The MatRIS-MoE team reports the full set of scaling numbers:

| Run | FP32 rate | Efficiency |
| --- | --- | --- |
| Weak scaling, large model | 1,200 PFlop/s | 90.3% |
| Weak scaling, medium model | 862 PFlop/s | 91.3% |
| Strong scaling, large model | 673 PFlop/s | 50.6% |
| 1,000 steps sustained, large model | 1,033 PFlop/s | 21% of FP32 peak |

![Strong scaling of MatRIS-MoE from 1/8 of the machine to all of it, on LineShine and on CNIS. LineShine reaches 672.5 PFlop/s with the large model. Zhou et al., arXiv:2604.15821, CC BY 4.0, figure 6.](/media/lineshine-arxiv-matris-scaling.png)

They cut MoE all-to-all volume in half by compressing it to FP16 per atom type, and overlapped gradient synchronisation with the optimizer step. Step time fell from 40.7 s to 8.1 s on the large model.

## The pattern

Every one of these codes either uses dense matrix kernels (training, DNS with spectral methods) or holds an enormous state (brain, chemical space). That is the profile LineShine was designed for: a big SME peak for the dense parts, a lot of DDR for the state, and HBM in between.
