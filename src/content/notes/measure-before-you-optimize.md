---
title: Measure before you optimise
summary: A CFD mini-app that was 'MPI bound' until we turned the VTK dumps off. Performance engineering as a habit, not a rewrite.
date: 2026-07-28
author: hpcnotes
tags: performance, io, mpi
---

The first profile on a production mesh is allowed to be embarrassing. The unforgivable part is rewriting the flux kernel before that profile exists.

## A short true-to-life sequence

We had a finite-volume code that "did not scale past 16 nodes". The MPI traces looked busy. Halo exchanges were the obvious villain.

We timed three runs on the same 8 nodes:

| Variant | Walltime |
| --- | --- |
| Production, full VTK every step | 41 min |
| VTK every 50 steps | 18 min |
| No VTK, same compute | 11 min |

The halo exchanges were fine. The parallel filesystem was taking a metadata beating from per-rank VTK. The "MPI problem" was I/O.

## What we changed

Not the Riemann solver. A single writer rank, larger intervals, and a binary format. Scaling to 64 nodes started to look like a solver again, at which point a real MPI issue (an unnecessary `Allreduce` in a residual check) was visible.

## Rules we kept

- One change per experiment
- The same mesh and the same node type
- A timer around **output**, **exchange**, and **update**, not only the whole executable
- No optimisation sprint during a conference deadline
