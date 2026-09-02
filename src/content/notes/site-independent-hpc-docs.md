---
title: Why site-independent HPC notes still matter
summary: Every centre has a hostname. None of them should have to re-explain MPI ranks from scratch.
date: 2026-08-24
author: hpcnotes
tags: documentation, portability
---

Campus clusters, national machines, and cloud partitions disagree about almost every proper noun: the login host, the GPU partition, the scratch purge. They agree about almost every concept: login nodes are not compute, collectives have to match, and walltime is a contract.

That split is the brief for these notes — dated, site-independent, and meant to sit beside a centre's own handbook.

## What belongs in a centre's docs

- Hostnames, jump hosts, and MFA
- Partition names, QoS, and fairshare
- Module names and the blessed compiler/MPI pair
- Scratch retention and how to call the helpdesk

If a sentence contains a string a user must type, it is probably local.

## What belongs in a portable note

- Why you should not run MPI on the login node
- How to size walltime from a short representative run
- What a data race looks like in OpenMP
- How to read a Lustre stripe without becoming a storage admin

If you maintain a centre handbook, the highest-leverage change is often a dozen links to notes like these, not a new CMS.
