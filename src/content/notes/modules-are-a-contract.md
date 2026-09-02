---
title: Environment modules are a contract
summary: The modulefile is how the machine tells you which compiler, MPI, and CUDA belong together. Mixing stacks by hand is how you get a weekend of undefined references.
date: 2024-09-18
author: hpcnotes
tags: modules, portability
---

A cluster is not a laptop with extra cores. The software you can see is a set of blessed combinations, and the modulefile is the contract for one of them.

## Load a stack, not a souvenir

`module load gcc openmpi cuda` from three different generations is how you get a binary that links and a job that dies in `MPI_Init`. Load the site's metapackage, or a versioned toolchain the handbook names. Then stop.

## `module purge` is not optional

Login profiles accumulate. Yesterday's PETSc is still in `LD_LIBRARY_PATH` when today's GROMACS starts. Purge, then load, in the job script, every time.

## Record what you loaded

`module list` in the job log is cheaper than reconstructing a toolchain from memory six months later, after the default GCC has moved. If the site offers `spack` or EasyBuild generated modules, pin the hash or the version, not "the default".

## What not to do

Do not `export PATH=$HOME/local/bin:$PATH` and then file a ticket that "MPI is broken". Your overlay is now the software stack. The helpdesk cannot see it.
