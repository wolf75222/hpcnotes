import type { Playlist } from "./types";

export const PLAYLISTS: Playlist[] = [
  {
    slug: "first-week",
    title: "First week on a cluster",
    summary:
      "Login, and a job that finishes.",
    slugs: [
      "login-nodes-are-not-compute",
      "slurm-jobs-that-finish",
    ],
  },
  {
    slug: "portable",
    title: "Notes that travel",
    summary: "What belongs in a centre handbook, and what should not.",
    slugs: [
      "site-independent-hpc-docs",
      "what-a-note-can-carry",
      "modules-are-a-contract",
      "login-nodes-are-not-compute",
    ],
  },
];
