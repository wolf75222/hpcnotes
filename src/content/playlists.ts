import type { Playlist } from "./types";

export const PLAYLISTS: Playlist[] = [
  {
    slug: "first-week",
    title: "First week on a cluster",
    summary:
      "Login, a job that finishes, and a GPU that actually sees a kernel.",
    slugs: [
      "login-nodes-are-not-compute",
      "slurm-jobs-that-finish",
      "first-gpu-kernel",
    ],
  },
  {
    slug: "performance",
    title: "Measure, then touch the solver",
    summary: "I/O, launchers, and the habit of one change per experiment.",
    slugs: ["measure-before-you-optimize", "slurm-jobs-that-finish"],
  },
  {
    slug: "portable",
    title: "Notes that travel",
    summary: "What belongs in a centre handbook, and what should not.",
    slugs: [
      "site-independent-hpc-docs",
      "modules-are-a-contract",
      "login-nodes-are-not-compute",
    ],
  },
];

export const PLAYLISTS_BY_SLUG = Object.fromEntries(
  PLAYLISTS.map((playlist) => [playlist.slug, playlist]),
) as Record<string, Playlist>;
