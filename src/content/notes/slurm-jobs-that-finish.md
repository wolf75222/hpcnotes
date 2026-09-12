---
title: Anatomy of a Slurm job that actually finishes
summary: The difference between a script that queued and a result you can publish is usually walltime, cwd, and the launcher — not the solver.
date: 2026-08-11
author: hpcnotes
tags: slurm, batch
parent: working-on-a-cluster
order: 3
---

A surprising number of "the cluster is broken" tickets are job scripts that never had a chance: wrong directory, stdout path that does not exist, `mpirun` that ignored the allocation, walltime copied from a colleague's 48-hour production run into a compile test.

## The five lines that matter

1. `#SBATCH --output=` pointing at a directory that **exists**.
2. An explicit `cd` to scratch.
3. `module purge` then a known-good stack.
4. `srun` (or the site launcher), not a naked `mpirun`.
5. A walltime you measured, plus a margin, not a round number from folklore.

## cwd is not the submission directory you remember

If you `sbatch ../scripts/run.slurm` from a random folder, relative paths inside the script follow Slurm's policy, not your intuition. Either `cd "$SLURM_SUBMIT_DIR"` **or** `cd` to an absolute scratch path. Pick one and stop mixing.

## Launchers

`mpirun -np 32 ./a.out` inside an `sbatch` allocation *sometimes* works. On a multi-rail InfiniBand machine with cgroups, it sometimes spreads ranks onto cores you do not own, or onto the login image. `srun ./a.out` asks the daemon that owns the job to start the ranks. That is the difference between a lucky workstation habit and a cluster program. The flags themselves are in the [sbatch](https://slurm.schedmd.com/sbatch.html) man page.

## Arrays instead of a shell for-loop

`for i in $(seq 0 999); do sbatch run.sh $i; done` makes the scheduler, the filesystem, and the support team sad. Job arrays exist. Use `%20` if you must cap concurrency.

## After it dies

`sacct -j JOBID` before you change the code. TIMEOUT, OOM, and a Python traceback in the log are different jobs. Fix the matching resource, not all of them at once.
