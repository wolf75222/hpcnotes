---
title: Login nodes are not compute
summary: If the shared login image is swapping, it is because someone compiled the universe there. Don't.
date: 2025-11-04
author: hpcnotes
tags: etiquette, batch
---

A login node is a waiting room with a compiler. It is not a 128-core workstation that happens to have SSH.

## What belongs on login

- Editing job scripts
- `sbatch`, `squeue`, `module spider`
- A tiny configure test, if the site asks for it

## What does not

- `make -j` on a full application
- Python that reads the whole mesh into RAM
- `mpirun` "just to see"

## Move the work

`salloc` for an interactive compile. A short serial job for a configure. Scratch, not `$HOME`, for anything that will be written again in ten minutes.

If you need a rule you can shout across the office: if it would make your laptop fan spin, it does not belong on login.
