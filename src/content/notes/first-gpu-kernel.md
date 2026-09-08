---
title: From login node to first GPU kernel
summary: A checklist for the first CUDA or HIP allocation: visibility, a tiny kernel, then the application module — in that order.
date: 2026-06-16
author: hpcnotes
tags: gpu, slurm
parent: working-on-a-cluster
order: 4
---

People skip from "I have a GPU partition" to "I built the full application" and then spend a day debugging a solver that never saw a device.

## Get an allocation that includes a GPU

```bash
salloc -N 1 --gpus=1 -t 00:20:00 -p gpu-debug
nvidia-smi   # or rocm-smi
echo $CUDA_VISIBLE_DEVICES
```

If this fails, **stop**. Compiling will not fix the scheduler.

## Run a kernel that is not your code

A 20-line vector add, built with the site CUDA/HIP module, launched with `srun`. Confirm the device name matches the partition you requested.

## Then load the application

Now `module load gromacs-gpu` (or whatever you actually wanted). Check that the binary is the GPU build. Run one timestep. Watch `nvidia-smi` in a second SSH **inside the allocation** if the site allows `srun --overlap`, or dump utilisation at the end of the job.

## Only then scale

Multi-GPU and multi-node GPU-aware MPI are where site stacks differ. They are not the first experiment.
