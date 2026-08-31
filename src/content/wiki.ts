import type { WikiPage } from "./types";

export const WIKI_PAGES: WikiPage[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    audience: "basics",
    summary:
      "A site-independent path from account to first job: access, login, files, modules, and the batch system.",
    updated: "2026-08-18",
    related: ["login-and-ssh", "environment-modules", "batch-systems"],
    body: `HPC Wiki collects **site-independent** high-performance computing practice: the ideas that stay true whether you run on a campus cluster, a national machine, or a cloud partition.

Every centre still has its own hostname, partitions, and storage layout. Treat local documentation as the source of truth for names and quotas, and this wiki as the map of the underlying concepts.

## What an HPC system is

A typical cluster is not one computer. It is:

1. **Login nodes** — shared front-ends where you edit, compile, and submit work. Do not run long or parallel jobs here.
2. **Compute nodes** — the machines the scheduler allocates to you. This is where MPI ranks, OpenMP threads, and GPUs actually run.
3. **A batch system** — almost always [Slurm](/wiki/batch-systems) or a close relative. You request resources; the scheduler decides *when*.
4. **Shared filesystems** — home, scratch, and project spaces with very different performance and retention policies. See [data transfer](/wiki/data-transfer).

## First hour on a new cluster

Work through these in order:

1. Confirm you can [log in with SSH](/wiki/login-and-ssh) and that your public key is the one the site expects.
2. Run \`hostname\`, \`pwd\`, and \`quota\` or the site's equivalent. Know which filesystem you are sitting on.
3. Load a compiler and an MPI stack with [environment modules](/wiki/environment-modules).
4. Submit a one-node, one-minute job so the [batch system](/wiki/batch-systems) is no longer theoretical.
5. Copy a small file **out** of the cluster. Downloads fail later, when the result actually matters.

## Mental model for resources

You never "log into a compute node and start working" the way you would on a laptop. You describe a **resource request**: nodes, cores, GPUs, walltime, memory, and a partition or Quality of Service. The scheduler matches that request to free hardware.

Over-asking (a whole node for a serial Python script, 48 hours for a 10-minute test) wastes the machine and delays everyone else, including you. Under-asking (too little memory, too little walltime) kills the job. Measure a short run before you scale.

## Where to go next

| If you need to… | Read |
| --- | --- |
| Open a shell on the machine | [Login and SSH](/wiki/login-and-ssh) |
| Compile or run installed software | [Environment modules](/wiki/environment-modules) |
| Move datasets | [Data transfer](/wiki/data-transfer) |
| Run anything longer than a minute | [Batch systems](/wiki/batch-systems) |
| Write a reusable job file | [Slurm job scripts](/wiki/slurm-job-scripts) |

The original [HPC Wiki](https://hpc-wiki.info/hpc/HPC_Wiki) organised the same audiences — Basics, Users, Developers, Admins — as a MediaWiki. This site keeps that split and the same site-independent brief, with a modern reading layout and a blog for longer notes.
`,
  },
  {
    slug: "login-and-ssh",
    title: "Login and SSH",
    audience: "basics",
    summary:
      "Keys, jump hosts, and the habits that keep login nodes usable: no heavy work on the front-end.",
    updated: "2026-07-02",
    related: ["getting-started", "data-transfer", "batch-systems"],
    body: `Almost every HPC centre exposes a **login node** over SSH. Graphical portals exist, but SSH is the portable skill: it works from a laptop, a CI runner, and another cluster.

## Keys, not passwords

Generate an Ed25519 key on your laptop and install the **public** half where the site tells you (portal, \`ssh-copy-id\`, or a ticket).

\`\`\`bash
ssh-keygen -t ed25519 -C "you@university.edu" -f ~/.ssh/id_ed25519_hpc
ssh -i ~/.ssh/id_ed25519_hpc alice@login.example.cluster
\`\`\`

Never copy the private key onto the cluster. If a site requires a passphrase (it should), load it into an agent so you are not typing it on every hop:

\`\`\`bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_hpc
\`\`\`

## Config file

A \`~/.ssh/config\` entry keeps jump hosts and identity files from becoming folklore:

\`\`\`text
Host hpc
  HostName login.example.cluster
  User alice
  IdentityFile ~/.ssh/id_ed25519_hpc
  ForwardAgent no
\`\`\`

Then \`ssh hpc\` is enough. Set \`ForwardAgent no\` unless you have a documented reason to forward keys; a compromised login node should not inherit access to GitHub or other clusters.

## Two-factor and jump hosts

Many sites sit behind a jump host or a two-factor prompt. \`ProxyJump\` in the SSH config is the robust form:

\`\`\`text
Host hpc-jump
  HostName jump.example.cluster
  User alice

Host hpc
  HostName login.example.cluster
  User alice
  ProxyJump hpc-jump
\`\`\`

## Login nodes are shared

Login nodes are **not** compute. Do not:

- Run OpenMP or MPI there
- Start a multi-hour Python notebook kernel that saturates RAM
- Unpack terabyte archives in \`$HOME\`

Compile, edit, and submit. Heavy work belongs in an [interactive or batch allocation](/wiki/batch-systems).

## First commands after login

\`\`\`bash
whoami
hostname
echo $HOME
module avail 2>&1 | head
sinfo -s    # Slurm; sites on PBS/LSF have equivalents
\`\`\`

If \`sinfo\` is missing, you are either on a login image without the scheduler client, or the site uses another batch system. Check local docs before assuming the cluster is broken.
`,
  },
  {
    slug: "environment-modules",
    title: "Environment modules",
    audience: "basics",
    summary:
      "How module, lmod, and software stacks let compilers, MPI, and applications coexist without fighting.",
    updated: "2026-06-21",
    related: ["getting-started", "application-software", "mpi"],
    body: `HPC systems install many compilers, MPI libraries, and applications **side by side**. They cannot all live on your default \`PATH\`. Environment modules (often Lmod) swap a consistent set of variables for a given stack.

## Everyday commands

\`\`\`bash
module avail                 # what the site offers
module spider fftw           # find a package across stacks
module load gcc/13 openmpi
module list
module unload openmpi
module purge                 # start from a clean shell
\`\`\`

After \`module load\`, \`which mpicc\` and \`echo $LD_LIBRARY_PATH\` should point at the stack you asked for. If they still point at \`/usr/bin/mpicc\`, the module did not take; a site-specific prefix or compiler toolchain is usually required first.

## Hierarchies

Modern Lmod deployments are **hierarchical**: you load a compiler, then an MPI built with that compiler, then libraries built with that pair. Loading \`openmpi\` before a compiler is a common way to get "module not found".

Typical order:

1. Compiler (\`gcc\`, \`intel\`, \`aocc\`, \`nvhpc\`)
2. MPI (\`openmpi\`, \`intel-mpi\`, \`cray-mpich\`)
3. Libraries and applications (\`fftw\`, \`hdf5\`, \`gromacs\`)

## Save a collection

\`\`\`bash
module load gcc/13 openmpi fftw hdf5
module save my-cfd
# later
module restore my-cfd
\`\`\`

Put \`module restore\` near the top of [job scripts](/wiki/slurm-job-scripts). Interactive shells and batch jobs do not share your login-node module state unless you recreate it.

## Containers and spack

Modules are not the only story. Some sites expose **Spack** views, **EasyBuild** stacks, or **Apptainer/Singularity** images. The rule is the same: the environment that compiled the binary must be the environment that runs it. Mixing a system libfabric with a container MPI is a classic silent hang.

## Recording the environment

When a result matters, dump the environment next to the output:

\`\`\`bash
module list -t > run.modules
lscpu > run.lscpu
\`\`\`

Reproducibility on HPC starts with "which compiler, which MPI, which module version", not with a screenshot of the terminal.
`,
  },
  {
    slug: "data-transfer",
    title: "Data transfer",
    audience: "basics",
    summary:
      "scp, rsync, and Globus; home versus scratch; why the login node is a poor place to stage a dataset.",
    updated: "2026-05-30",
    related: ["login-and-ssh", "getting-started", "parallel-filesystems"],
    body: `Moving data is where HPC projects stall. The compute is ready; the files are still on a laptop, a core facility instrument, or another centre.

## Choose the right tool

| Size | Tool | Notes |
| --- | --- | --- |
| Kilobytes to a few gigabytes | \`scp\` / \`sftp\` | Fine for source, plots, small restarts |
| Tens of gigabytes, resume | \`rsync -avP\` | Partial transfers, permissions |
| Terabytes, cross-site | Globus, Aspera, site object storage | Parallel, fire-and-forget |

\`\`\`bash
rsync -avP ./dataset/ hpc:scratch/project/dataset/
\`\`\`

GridFTP/Globus endpoints are worth the one-time setup as soon as a copy takes longer than a coffee. They retry, they do not depend on your laptop staying awake, and they usually hit a dedicated data mover rather than the login node.

## Home is not scratch

- **Home** — small, backed up, slow under parallel I/O. Source code and papers.
- **Scratch / work** — large, parallel, often **purged**. Simulation output and checkpoints.
- **Project / tape** — quota'd, shared with a group, sometimes hierarchical storage.

Writing thousands of tiny files from every MPI rank into \`$HOME\` will make the metadata server miserable and your job slow. Stage input to scratch, run, then copy the subset you need to keep.

## Do not stage on the login node

Copying a 4 TB tree through a login node disk fills a shared machine and can get your account throttled. Use:

- A dedicated **data transfer node** (DTN) if the site publishes one
- Globus shared endpoints
- Object storage (S3-compatible) when the site offers it

## Checksums

After any important copy:

\`\`\`bash
find dataset -type f | sort | xargs sha256sum > dataset.sha256
\`\`\`

Compare that manifest on both sides. HPC filesystems are reliable; WAN copies and human rsync flags are not.

## Leaving the cluster

Plan the **egress** before the job starts. Some machines allow inbound \`scp\` but block outbound to arbitrary hosts. Others charge for leaving a cloud region. A result that cannot leave the scratch purge window is not a result.
`,
  },
  {
    slug: "batch-systems",
    title: "Batch systems",
    audience: "user",
    summary:
      "Why HPC uses a scheduler, what a partition is, and how to think about walltime, memory, and fairness.",
    updated: "2026-08-01",
    related: ["slurm-job-scripts", "getting-started", "resource-managers"],
    body: `Interactive computing does not scale to a thousand users sharing tens of thousands of cores. A **batch system** (scheduler + resource manager) queues work and launches it when the requested CPUs, GPUs, memory, and walltime are free.

On most academic and national machines today that stack is **Slurm**. PBS Pro, LSF, and Flux appear too. The concepts transfer; the flags do not.

## The contract

You submit a **job** that says:

- How many nodes / tasks / CPUs per task
- How much memory
- How long it may run (**walltime**)
- Which **partition** or queue (GPU, high-memory, debug, preemptible)
- Which account or project to charge

The scheduler's job is fairness and utilisation, not making your job start immediately. A 30-second debug job on a debug partition will usually start sooner than a 48-hour 32-node job — by design.

## Interactive versus batch

\`\`\`bash
# Interactive allocation (Slurm)
salloc -N 1 -n 8 -t 00:30:00 -p debug
# Batch
sbatch run.slurm
\`\`\`

Use interactive allocations to compile, debug, and size a run. Use batch for anything you want to survive a dropped SSH connection. See [Slurm job scripts](/wiki/slurm-job-scripts) for a complete file.

## Walltime and memory

- If walltime expires, the job is **killed**. Checkpoint if the run is long.
- If memory exceeds the request, the job is **killed** (oom). \`sacct\` / site monitoring will show it.
- Asking for a whole node when you use one core wastes the other cores for everyone, including the jobs behind you.

A practical loop: run a **short representative** case, read the reported elapsed time and high-water memory, then add a modest margin.

## Why the queue is long

Backfill, reservations, maintenance, QoS limits, and fairshare all affect wait time. \`squeue --me\` tells you *where* you sit; it does not explain policy. Local documentation lists partition limits — max walltime, max nodes per user — that silently reject or delay jobs.

## What not to do

- Busy-loop on the login node "because the queue is long"
- Submit a thousand 1-minute jobs when a [job array](/wiki/slurm-job-scripts) would do
- Request GPUs and then run a CPU-only binary

The scheduler is part of the machine. Treating it as an obstacle usually makes the wait longer.
`,
  },
  {
    slug: "slurm-job-scripts",
    title: "Slurm job scripts",
    audience: "user",
    summary:
      "A complete sbatch template: resources, modules, MPI launch, arrays, and where to put stdout.",
    updated: "2026-08-12",
    related: ["batch-systems", "mpi", "environment-modules"],
    body: `A job script is a shell script with \`#SBATCH\` directives the scheduler reads **before** the script runs. Anything that is not an \`#SBATCH\` line is ordinary bash, executed on the allocated nodes.

## Minimal MPI example

\`\`\`bash
#!/bin/bash
#SBATCH --job-name=cfd-weak
#SBATCH --account=project_xyz
#SBATCH --partition=compute
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=32
#SBATCH --cpus-per-task=1
#SBATCH --time=02:00:00
#SBATCH --output=logs/%x-%j.out

set -euo pipefail
module purge
module load gcc/13 openmpi

srun ./solver ./cases/cylinder.yaml
\`\`\`

\`srun\` (or the site's MPI launcher) is what starts ranks **inside** the allocation. \`mpirun\` without Slurm integration can ignore bindings and spread ranks onto the login node. Prefer \`srun\` unless local docs say otherwise.

## OpenMP hybrid

For hybrid MPI+OpenMP, pin threads to cores and tell both runtimes the truth:

\`\`\`bash
#SBATCH --ntasks-per-node=4
#SBATCH --cpus-per-task=8
export OMP_NUM_THREADS=\$SLURM_CPUS_PER_TASK
export OMP_PROC_BIND=spread
srun ./hybrid
\`\`\`

If \`OMP_NUM_THREADS\` is larger than \`cpus-per-task\`, you oversubscribe and performance falls off a cliff. See [OpenMP](/wiki/openmp).

## Job arrays

Parameter sweeps belong in arrays, not in a shell loop that calls \`sbatch\` a thousand times:

\`\`\`bash
#SBATCH --array=0-199
#SBATCH --ntasks=1
#SBATCH --time=00:20:00

python sweep.py --index "\$SLURM_ARRAY_TASK_ID"
\`\`\`

Cap concurrent tasks with \`#SBATCH --array=0-199%20\` when the filesystem or licence server cannot take the full burst.

## Output, working directory, and cleanup

- Create \`logs/\` before submitting; Slurm will not mkdir for you.
- \`cd\` to the scratch directory explicitly. The submission CWD is not always what you think.
- Write checkpoints to scratch, not \`$HOME\`.

## Inspecting a finished job

\`\`\`bash
sacct -j 123456 --format=JobID,State,Elapsed,MaxRSS,ReqMem,ExitCode
\`\`\`

\`OUT_OF_MEMORY\`, \`TIMEOUT\`, and \`CANCELLED\` are different failures. Fix the matching resource, not all of them at once.

A longer walkthrough of jobs that actually finish lives in the [blog](/blog/slurm-jobs-that-finish).
`,
  },
  {
    slug: "parallel-filesystems",
    title: "Parallel filesystems",
    audience: "user",
    summary:
      "Lustre, GPFS, and NFS: striping, metadata, and how naive I/O patterns stall a cluster.",
    updated: "2026-04-14",
    related: ["data-transfer", "performance-engineering", "cluster-architecture"],
    body: `Compute nodes almost never run on a local disk worth caring about. They share a **parallel filesystem** (Lustre, GPFS/Storage Scale, BeeGFS) and often an NFS home. Those systems are fast at large sequential I/O and unhappy at millions of tiny files.

## Metadata versus bandwidth

Creating a file, \`stat\`-ing it, or listing a directory hits the **metadata** service. Reading a 200 GB checkpoint hits **object storage targets**. A job that opens one file per cell of a 10⁸ mesh will spend its time in metadata even if the cluster's billed I/O rate looks huge.

Practical rules:

- Prefer a few large files (HDF5, NetCDF, MPI-IO) over one file per rank unless the site documents otherwise.
- Avoid \`ls\` on directories with hundreds of thousands of entries.
- Do not store Python \`__pycache__\` or conda environments on Lustre if the site provides a local or container alternative.

## Striping (Lustre)

On Lustre you can set how a file is spread across storage targets:

\`\`\`bash
lfs setstripe -c 8 -S 4M ./big-output/
\`\`\`

A single-stripe file cannot exceed one target's bandwidth. A file striped across too many targets pays extra for small reads. Match stripe count to file size and to how many ranks will read it.

## Home, scratch, burst buffer

- **NFS home** — convenient, consistent, not for parallel I/O.
- **Parallel scratch** — the default for running jobs; often purged.
- **Burst buffers / node-local SSD** — stage in, run, stage out. Worth it when the job is I/O bound.

## Measuring before blaming the solver

If a code "suddenly got slow", look at I/O:

- Time a run with output disabled
- Compare to a run on node-local storage if available
- Watch whether all ranks write at the same timestep (I/O storms)

[Performance engineering](/wiki/performance-engineering) starts with measurement; filesystems are a frequent real answer.
`,
  },
  {
    slug: "application-software",
    title: "Application software",
    audience: "user",
    summary:
      "Running GROMACS, OpenFOAM, and other third-party codes: modules, input, and licences.",
    updated: "2026-03-09",
    related: ["environment-modules", "slurm-job-scripts", "gpu-computing"],
    body: `Most HPC hours are not spent on codes people compiled from a git checkout. They are spent on **community applications**: GROMACS, NAMD, OpenFOAM, VASP, Quantum ESPRESSO, WRF, and the rest.

## Prefer the site build

Centres spend a lot of effort building those codes against the local MPI, GPU stack, and network. \`module spider gromacs\` (or the site's application catalogue) is the first stop. A hand-built binary that ignores the local libfabric or CUDA driver will run, then hang at scale.

When you must build yourself, use the same compiler and MPI the site documents for that application family. See [environment modules](/wiki/environment-modules).

## Input and licences

- Keep inputs on scratch next to the run directory.
- Licence servers (those floating ANSYS/VASP tokens) have **concurrency limits**. Request the cores you need, not the partition maximum.
- GPU builds and CPU builds are different modules. Loading the CPU module on a GPU partition wastes the GPU.

## A typical application job

\`\`\`bash
#!/bin/bash
#SBATCH --nodes=1
#SBATCH --ntasks=32
#SBATCH --time=08:00:00
#SBATCH --partition=compute

module load gromacs
srun gmx_mpi mdrun -s topol.tpr -deffnm prod
\`\`\`

Read the application's own HPC notes for thread-MPI versus library MPI, and for GPU offload flags. They change between major versions.

## Containers

Apptainer/Singularity images are the portable fallback when the site does not ship your version. Bind-mount scratch, do not write into the image, and still launch with \`srun\` so bindings stay under Slurm.

The [HPC user](/wiki/category/user) section assumes you are driving existing software. If you are changing the solver, move to [HPC developer](/wiki/category/developer).
`,
  },
  {
    slug: "mpi",
    title: "MPI",
    audience: "developer",
    summary:
      "Ranks, communicators, collectives, and the mistakes that hang at 128 nodes but pass on 2.",
    updated: "2026-08-04",
    related: ["openmp", "slurm-job-scripts", "debugging-and-correctness"],
    body: `The Message Passing Interface is the portable way to run **distributed-memory** programs on HPC. Each **rank** is a process with its own address space. They exchange messages; they do not share objects unless you build that yourself.

## Minimal program

\`\`\`c
#include <mpi.h>
#include <stdio.h>

int main(int argc, char** argv) {
  MPI_Init(&argc, &argv);
  int rank, n;
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Comm_size(MPI_COMM_WORLD, &n);
  printf("rank %d of %d\\n", rank, n);
  MPI_Finalize();
  return 0;
}
\`\`\`

Build with the **wrapped** compilers from the loaded MPI module (\`mpicc\`, \`mpicxx\`, \`mpif90\`), not with raw \`gcc\` plus a guessed \`-lmpi\`.

## Collectives have to match

Every rank in a communicator must call the same collective (\`MPI_Bcast\`, \`MPI_Allreduce\`, \`MPI_Barrier\`) in the same order. A rank that takes an early \`return\` on an error path while others enter \`MPI_Allreduce\` **deadlocks**. That bug passes on two ranks and appears on a long weekend job.

Tools: [MUST](https://doc.itc.rwth-aachen.de/display/CCP/Project+MUST), compiler sanitizers, and the [debugging](/wiki/debugging-and-correctness) notes.

## Bindings

At more than a few nodes, **process placement** dominates. \`srun --cpu-bind=cores\` (or the site equivalent) keeps ranks off hyperthread siblings you did not want. Mixing OpenMP threads without setting \`OMP_NUM_THREADS\` and CPU binding is how hybrid codes look "fine" in \`htop\` and slow in the timer.

## MPI I/O

Independent POSIX writes from every rank to a shared file contend. MPI-IO, HDF5 parallel, or a dedicated I/O rank is the usual fix. See [parallel filesystems](/wiki/parallel-filesystems).

## What MPI is not

MPI is not a cluster scheduler. \`MPI_Comm_spawn\` exists; it is not how you request GPUs on a shared machine. Submit through [Slurm](/wiki/slurm-job-scripts), then start ranks in the allocation you already have.
`,
  },
  {
    slug: "openmp",
    title: "OpenMP",
    audience: "developer",
    summary:
      "Shared-memory parallelism on a node: threads, binding, reductions, and when not to nest MPI.",
    updated: "2026-07-19",
    related: ["mpi", "performance-engineering", "gpu-computing"],
    body: `OpenMP is the pragmatic way to use **the cores on one node** from a single process: compiler directives, a runtime, and an environment that must agree with the batch system.

## A reduction that is actually parallel

\`\`\`c
#pragma omp parallel for reduction(+:sum) schedule(static)
for (int i = 0; i < n; i++) {
  sum += a[i];
}
\`\`\`

Compile with \`-fopenmp\` (GCC/Clang) or \`-qopenmp\` (Intel). If \`OMP_NUM_THREADS\` is unset you may silently get one thread per visible core — including cores Slurm did not allocate.

## Honour the allocation

\`\`\`bash
export OMP_NUM_THREADS=\${SLURM_CPUS_PER_TASK:-1}
export OMP_PROC_BIND=true
export OMP_PLACES=cores
\`\`\`

Oversubscription (32 threads on 8 allocated cores) looks busy and runs slower. Undersubscription wastes the node you paid walltime for.

## Data races

OpenMP does not make your loops correct. Shared writes without a reduction, atomic, or critical section are data races. Compiler thread sanitizers catch many of them; they are cheaper than a wrong scientific figure.

## Hybrid MPI+OpenMP

A common pattern: **one MPI rank per socket or NUMA node**, OpenMP inside. That cuts MPI ranks (nicer for collectives and memory) and keeps threads on local memory.

Nesting MPI ranks × OpenMP threads × GPU streams without a plan produces 200% CPU and a stalled kernel. Pin first, then measure. See [performance engineering](/wiki/performance-engineering).

## Offload

OpenMP target offload (\`omp target\`) is one path to GPUs. CUDA, HIP, and SYCL are others. Pick the one your site's compiler stack actually tests; "OpenMP GPU" that falls back to the host is a frequent surprise. Confirm with a runtime print of the device or with \`nvidia-smi\` / \`rocm-smi\` inside the job.
`,
  },
  {
    slug: "gpu-computing",
    title: "GPU computing",
    audience: "developer",
    summary:
      "CUDA, HIP, and the scheduler: device visibility, data movement, and occupancy versus the PCIe bus.",
    updated: "2026-08-20",
    related: ["openmp", "slurm-job-scripts", "performance-engineering"],
    body: `GPUs dominate new HPC procurement. They also dominate new failure modes: the job requested a GPU, the process never saw it, and the CPU fallback ran for 48 hours.

## Make the device visible

In Slurm:

\`\`\`bash
#SBATCH --gpus-per-node=1
# or, on older sites:
#SBATCH --gres=gpu:1
\`\`\`

Inside the job:

\`\`\`bash
nvidia-smi   # NVIDIA
rocm-smi     # AMD
echo \$CUDA_VISIBLE_DEVICES
\`\`\`

If \`CUDA_VISIBLE_DEVICES\` is empty, you are not on a GPU allocation. Do not assume device 0 on a shared login node is yours.

## Data movement is the tax

A kernel that looks impressive in isolation can be bound by host–device copies. Strategies that still work:

- Keep working sets on the device across timesteps
- Use pinned host memory for transfers you cannot avoid
- Prefer GPU-aware MPI when the stack is actually GPU-aware (ask the site; "should be" is not a measurement)

## Occupancy is not the goal

High occupancy is a hint, not a score. A kernel with perfect occupancy that streams the whole mesh from HBM every call can still lose to a lower-occupancy kernel with better locality. Profile with Nsight, rocprof, or the vendor's equivalent on a **representative** problem size, not a 32³ unit test.

## One rank per GPU, unless you measured otherwise

The default that wastes the least time: **one MPI rank per GPU**, maybe a few host threads for packing. Multi-process service (MPS) and MIG are site-specific and easy to misconfigure.

## Containers and CUDA

Container images must match the **driver** on the node, not the CUDA toolkit you built with last year. Sites usually publish a supported tag list. Ignore it and you get \`cudaErrorInsufficientDriver\` at the worst possible moment.

A first-person walkthrough is in [From login node to first GPU kernel](/blog/first-gpu-kernel).
`,
  },
  {
    slug: "performance-engineering",
    title: "Performance engineering",
    audience: "developer",
    summary:
      "Measure before you optimise: timers, hardware counters, strong versus weak scaling, and rooflines.",
    updated: "2026-08-08",
    related: ["mpi", "gpu-computing", "debugging-and-correctness"],
    body: `Performance engineering is a loop: **measure, hypothesise, change one thing, measure again**. Starting with a rewrite of the solver's inner loop is how projects lose a month and keep the same bottleneck (often I/O or MPI).

## Time the right thing

Walltime of the whole job includes queue time, module load, and mesh generation. Instrument:

- Setup versus timestep versus output
- Per-rank timers around communication and compute
- A short run at production resolution, not a toy mesh

\`\`\`bash
# crude but honest
/usr/bin/time -f "elapsed %e maxrss %M" srun ./app
\`\`\`

Better: source-level timers, Score-P, or vendor tools (VTune, Nsight, CrayPat) that the site actually supports.

## Scaling experiments

- **Strong scaling** — fixed problem, more resources. Speedup should be compared to the *same* node type.
- **Weak scaling** — problem size grows with resources. Looks for communication and memory issues that strong scaling hides.

Plot efficiency, not only "it was faster". 1.1× on 2× the GPUs is a regression you can still brag about if you only quote walltime.

## Roofline thinking

Is the kernel **memory-bound** or **compute-bound** on this machine? A cache-blocked CPU loop and an HBM-bound GPU kernel need different work. Likwid, perf, and Nsight Compute answer this; guessing does not.

## Communication

\`MPI_Alltoall\` on 8k ranks, or a naive neighbour halo that serialises, will not be fixed by \`-O3\`. Rank reordering, overlapping communication with compute, and reducing the number of ranks per node (hybrid) are the usual levers.

## I/O

Disable output and time again. If the job doubles in speed, you do not have a compute problem. See [parallel filesystems](/wiki/parallel-filesystems).

The blog note [Measure before you optimise](/blog/measure-before-you-optimize) walks through a single case study.
`,
  },
  {
    slug: "debugging-and-correctness",
    title: "Debugging and correctness",
    audience: "developer",
    summary:
      "Sanitizers, MUST, rank-aware gdb, and why floating-point mismatches are sometimes reductions.",
    updated: "2026-06-28",
    related: ["mpi", "performance-engineering", "getting-started"],
    body: `A parallel program can be wrong in ways a serial unit test never sees: races, unmatched collectives, uninitialised halo cells, and reductions whose order changed.

## Cheap filters first

\`\`\`bash
# GCC/Clang
cmake -DCMAKE_BUILD_TYPE=Debug \\
      -DCMAKE_C_FLAGS="-fsanitize=address,undefined" \\
      ..
\`\`\`

Address and undefined-behaviour sanitizers catch a surprising fraction of "only fails on the cluster" bugs **on a workstation**, with one rank. Thread sanitizer is slower and worth it for OpenMP.

## MPI-aware tools

- **MUST** — checks MPI usage at runtime (wildcard receives, datatype mismatches, collective order).
- **Stat / Distributed debugging** — attach to a subset of ranks rather than 4,096 gdb sessions.
- Vendor parallel debuggers (Linaro DDT, TotalView) when the site has licences.

Reproducing with \`srun -n 4\` on a debug partition is the first goal. If the bug needs 512 ranks, reduce the domain and keep the communication pattern.

## Floating point

Changing MPI rank count, SIMD width, or GPU vs CPU will change the last bits of a reduction. Decide in advance:

- Bitwise reproducibility (rare, expensive)
- A physical residual or conservation check (usual)

Do not chase ulps across architectures unless the science requires it.

## Hangs

A hang is often an unmatched collective or a blocking receive that never matches. Print rank and a breadcrumb **before** the suspect call, with flush. Timeout wrappers (\`timeout 30 srun ...\`) beat waiting for walltime on a debug job.

## Core dumps on the cluster

Enable them in the job, write them to scratch, and copy **one** representative dump off the machine. A thousand 20 GB cores in \`$HOME\` is how you learn about quota the hard way.
`,
  },
  {
    slug: "cluster-architecture",
    title: "Cluster architecture",
    audience: "admin",
    summary:
      "Login, compute, fabric, and storage as a contract: what users can assume and what they must not.",
    updated: "2026-02-17",
    related: ["resource-managers", "parallel-filesystems", "getting-started"],
    body: `From the user side, a cluster is a hostname and a queue. From the operator side it is several networks, a scheduler, an identity system, and a storage fabric that all have to fail independently without taking science down with them.

This page is the **user-facing** architecture, not a procurement guide.

## Node roles

| Role | Users should |
| --- | --- |
| Login / visualisation | Edit, compile, submit, light post-process |
| Compute | Run allocated jobs only |
| Data transfer | Stage large datasets |
| Management | Never log in |

A job that SSHs to other compute nodes outside the scheduler, or that assumes a shared \`/tmp\` across nodes, is depending on an accident.

## Networks

HPC machines typically have:

- An **Ethernet** (or similar) management/login network
- A **high-speed fabric** (InfiniBand, Slingshot, RoCE) for MPI and sometimes storage
- Sometimes a **storage network** distinct from MPI

MPI libraries must be built for the fabric. That is why [site MPI modules](/wiki/environment-modules) exist, and why a laptop OpenMPI in a container can look connected and then time out.

## Identity and accounts

Unix uid, the scheduler account, and the storage group are not always the same string. Users who can log in but cannot \`sbatch\` usually have an identity mapping problem, not a broken Slurm. Admins: document the mapping. Users: open a ticket with \`id\`, \`sacctmgr show user \$USER\`, and the error.

## Failure domains

A parallel filesystem outage, a licence server outage, and a login-node reboot are different incidents. Users should checkpoint; operators should publish which services are down. The [batch system](/wiki/batch-systems) cannot schedule around a filesystem that is not there.

## What "site-independent" still needs locally

Hostnames, partition names, GPU types, scratch purge policy, and the blessed MPI stack **must** come from local docs. HPC Wiki will not pretend your partition is called \`compute\`.
`,
  },
  {
    slug: "resource-managers",
    title: "Resource managers",
    audience: "admin",
    summary:
      "Slurm, PBS, and Flux as policies: partitions, fairshare, accounting, and the knobs users feel.",
    updated: "2026-01-22",
    related: ["batch-systems", "cluster-architecture", "slurm-job-scripts"],
    body: `A resource manager is the software that **owns the nodes**: tracking allocations, launching tasks, killing walltime violators, and feeding accounting. Slurm's \`slurmd\` + \`slurmctld\` is the common case. Users meet it as \`sbatch\`; operators meet it as policy.

## Policies users actually feel

- **Fairshare** — past usage slows future scheduling. A group that emptied the machine last month waits longer this month.
- **QoS / partitions** — debug versus production versus preemptible. Preemptible jobs start faster and die sooner.
- **Limits** — max jobs, max nodes, max walltime per user or account.
- **Reservations** — courses, dedicated machines, maintenance.

Document these in human language. \`MaxSubmitPU\` in \`slurm.conf\` is not documentation.

## Accounting

Jobs need an **account** that maps to a project, a grant, or a department. When accounting is optional, nobody can answer "who used the GPUs". When it is mandatory and the error is \`Invalid account\`, users need a self-service path, not a mailing list with a two-week SLA.

## Launchers

The resource manager should be the one that starts tasks (\`srun\`, \`jsrun\`, Flux brokers). Allowing users to \`ssh node42 mpirun\` bypasses cgroups, GPU isolation, and accounting. Close that door or accept the support tickets.

## Drain versus down

Operators: a **draining** node finishes current jobs; a **down** node does not. Users: a sudden drop in idle nodes is often maintenance, not a conspiracy. Publish a status page.

## Flux and the next generation

Flux and similar systems change the job hierarchy (jobs can start jobs) but not the user's need for a clear request: time, nodes, GPUs, account. Teach the **request**, then the command of the week.

See also [batch systems](/wiki/batch-systems) for the user-side of the same machinery.
`,
  },
];

export const WIKI_BY_SLUG = Object.fromEntries(
  WIKI_PAGES.map((page) => [page.slug, page]),
) as Record<string, WikiPage>;
