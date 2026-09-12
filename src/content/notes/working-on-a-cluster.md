---
title: Working on a shared cluster
summary: Login, modules, a job that finishes, then a first GPU kernel. One note, four pages.
date: 2026-09-08
author: hpcnotes
kind: note
tags: batch, slurm
---

A cluster is a waiting room, a contract for software, a scheduler, and only then an accelerator. These notes stay in that order.

The [login image](/notes/login-nodes-are-not-compute) is not a workstation. The [modulefile](/notes/modules-are-a-contract) is the stack you actually have. A job that finishes is mostly walltime, cwd, and the launcher. A GPU run starts with a device you can see, not the full application.

The four-rank cartoon is the shape of an `srun`, not a screenshot from a centre.

![Four ranks on a mesh, each with a neighbour exchange](/media/ranks.svg)

Slurm's [sbatch](https://slurm.schedmd.com/sbatch.html) is the usual door. The first page is [login-node etiquette](/notes/login-nodes-are-not-compute).
