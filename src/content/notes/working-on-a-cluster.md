---
title: Working on a shared cluster
summary: Login, modules, a job that finishes, then a first GPU kernel. One note, four pages.
date: 2026-09-08
author: hpcnotes
kind: note
tags: batch, slurm
---

A cluster is a waiting room, a contract for software, a scheduler, and only then an accelerator. These notes stay in that order.

The login image is not a workstation. The modulefile is the stack you actually have. A job that finishes is mostly walltime, cwd, and the launcher. A GPU run starts with a device you can see, not the full application.
