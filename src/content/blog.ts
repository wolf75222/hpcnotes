import type { BlogPost } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "site-independent-hpc-docs",
    title: "Why site-independent HPC documentation still matters",
    summary:
      "Every centre has a hostname. None of them should have to re-explain MPI ranks from scratch. How HPC Wiki splits local facts from portable practice.",
    date: "2026-08-24",
    author: "HPC Wiki editors",
    tags: ["community", "documentation"],
    body: `Campus clusters, national machines, and cloud partitions disagree about almost every proper noun: the login host, the GPU partition, the scratch purge. They agree about almost every concept: login nodes are not compute, collectives have to match, and walltime is a contract.

That split is the whole idea behind HPC Wiki — the same brief as the [classic MediaWiki](https://hpc-wiki.info/hpc/HPC_Wiki), written for a reading layout that is not a left-hand toolbox from 2006.

## What belongs in a centre's docs

- Hostnames, jump hosts, and MFA
- Partition names, QoS, and fairshare
- Module names and the blessed compiler/MPI pair
- Scratch retention and how to call the helpdesk

If a sentence contains a string a user must type, it is probably local.

## What belongs here

- Why you should not run MPI on the login node
- How to size walltime from a short representative run
- What a data race looks like in OpenMP
- How to read a Lustre stripe without becoming a storage admin

Those pages should be **linkable** from local docs: one paragraph of site facts, then "concepts: HPC Wiki". Duplicating the MPI tutorial in every centre's Confluence is how the tutorial rots.

## Blog versus wiki

The wiki is the durable map, organised by audience (Basics, Users, Developers, Admins). The blog is dated and argumentative: war stories, tool releases, opinions about measurement. Both are first-class here, because people actually learn from both.

If you maintain a centre handbook, the highest-leverage change is often a dozen links, not a new CMS.
`,
  },
  {
    slug: "slurm-jobs-that-finish",
    title: "Anatomy of a Slurm job that actually finishes",
    summary:
      "The difference between a script that queued and a result you can publish is usually walltime, cwd, and the launcher — not the solver.",
    date: "2026-08-11",
    author: "HPC Wiki editors",
    tags: ["slurm", "users"],
    body: `A surprising number of "the cluster is broken" tickets are job scripts that never had a chance: wrong directory, stdout path that does not exist, \`mpirun\` that ignored the allocation, walltime copied from a colleague's 48-hour production run into a compile test.

## The five lines that matter

1. \`#SBATCH --output=\` pointing at a directory that **exists**.
2. An explicit \`cd\` to scratch.
3. \`module purge\` then a known-good stack.
4. \`srun\` (or the site launcher), not a naked \`mpirun\`.
5. A walltime you measured, plus a margin, not a round number from folklore.

The [job script page](/wiki/slurm-job-scripts) has a full template. This note is about the failure modes that template is defending against.

## cwd is not the submission directory you remember

If you \`sbatch ../scripts/run.slurm\` from a random folder, relative paths inside the script follow Slurm's policy, not your intuition. Either \`cd "\$SLURM_SUBMIT_DIR"\` **or** \`cd\` to an absolute scratch path. Pick one and stop mixing.

## Launchers

\`mpirun -np 32 ./a.out\` inside an \`sbatch\` allocation *sometimes* works. On a multi-rail InfiniBand machine with cgroups, it sometimes spreads ranks onto cores you do not own, or onto the login image. \`srun ./a.out\` asks the daemon that owns the job to start the ranks. That is the difference between a lucky workstation habit and a cluster program.

## Arrays instead of a shell for-loop

\`for i in \$(seq 0 999); do sbatch run.sh \$i; done\` makes the scheduler, the filesystem, and the support team sad. Job arrays exist. Use \`%20\` if you must cap concurrency.

## After it dies

\`sacct -j JOBID\` before you change the code. TIMEOUT, OOM, and a Python traceback in the log are different jobs. The [batch systems](/wiki/batch-systems) page is the concept; \`sacct\` is the evidence.
`,
  },
  {
    slug: "measure-before-you-optimize",
    title: "Measure before you optimise",
    summary:
      "A CFD mini-app that was 'MPI bound' until we turned the VTK dumps off. Performance engineering as a habit, not a rewrite.",
    date: "2026-07-28",
    author: "HPC Wiki editors",
    tags: ["performance", "developers"],
    body: `The first profile on a production mesh is allowed to be embarrassing. The unforgivable part is rewriting the flux kernel before that profile exists.

## A short true-to-life sequence

We had a finite-volume code that "did not scale past 16 nodes". The MPI traces looked busy. Halo exchanges were the obvious villain.

We timed three runs on the same 8 nodes:

| Variant | Walltime |
| --- | --- |
| Production, full VTK every step | 41 min |
| VTK every 50 steps | 18 min |
| No VTK, same compute | 11 min |

The halo exchanges were fine. The parallel filesystem was taking a metadata beating from per-rank VTK. The "MPI problem" was [I/O](/wiki/parallel-filesystems).

## What we changed

Not the Riemann solver. A single writer rank, larger intervals, and a binary format. Scaling to 64 nodes started to look like a solver again, at which point a real MPI issue (an unnecessary \`Allreduce\` in a residual check) was visible.

## Rules we kept

- One change per experiment
- The same mesh and the same node type
- A timer around **output**, **exchange**, and **update**, not only the whole executable
- No optimisation sprint during a conference deadline

The durable version of this is the [performance engineering](/wiki/performance-engineering) wiki page. The blog exists so the VTK story can stay a story.
`,
  },
  {
    slug: "first-gpu-kernel",
    title: "From login node to first GPU kernel",
    summary:
      "A checklist for the first CUDA or HIP allocation: visibility, a tiny kernel, then the application module — in that order.",
    date: "2026-06-16",
    author: "HPC Wiki editors",
    tags: ["gpu", "developers"],
    body: `People skip from "I have a GPU partition" to "I built the full application" and then spend a day debugging a solver that never saw a device.

## 1. Get an allocation that includes a GPU

\`\`\`bash
salloc -N 1 --gpus=1 -t 00:20:00 -p gpu-debug
nvidia-smi   # or rocm-smi
echo \$CUDA_VISIBLE_DEVICES
\`\`\`

If this fails, **stop**. Compiling will not fix the scheduler.

## 2. Run a kernel that is not your code

A 20-line vector add, built with the site CUDA/HIP module, launched with \`srun\`. Confirm the device name matches the partition you requested.

## 3. Then load the application

Now \`module load gromacs-gpu\` (or whatever you actually wanted). Check that the binary is the GPU build. Run one timestep. Watch \`nvidia-smi\` in a second SSH **inside the allocation** if the site allows \`srun --overlap\`, or dump utilisation at the end of the job.

## 4. Only then scale

Multi-GPU and multi-node GPU-aware MPI are where site stacks differ. They are not the first experiment.

The wiki page [GPU computing](/wiki/gpu-computing) keeps the durable checklist. This post is the order of operations we wish was on every course slide.
`,
  },
];

export const BLOG_BY_SLUG = Object.fromEntries(
  BLOG_POSTS.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;
