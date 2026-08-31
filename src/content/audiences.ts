import type { WikiAudience, WikiAudienceMeta, TokenColor } from "./types";

export const AUDIENCES: WikiAudienceMeta[] = [
  {
    id: "basics",
    title: "Basics",
    shortTitle: "Basics",
    summary:
      "First login, the Unix shell, modules, and moving data. Written for people who have never used a cluster.",
    href: "/wiki/category/basics",
    tokenColor: "teal",
  },
  {
    id: "user",
    title: "HPC user",
    shortTitle: "Users",
    summary:
      "Batch systems, job scripts, filesystems, and running existing simulation software on shared machines.",
    href: "/wiki/category/user",
    tokenColor: "blue",
  },
  {
    id: "developer",
    title: "HPC developer",
    shortTitle: "Developers",
    summary:
      "MPI, OpenMP, GPUs, performance engineering, and tools that keep parallel programs correct.",
    href: "/wiki/category/developer",
    tokenColor: "purple",
  },
  {
    id: "admin",
    title: "HPC admin",
    shortTitle: "Admins",
    summary:
      "How clusters are put together: schedulers, storage, and the contracts users actually depend on.",
    href: "/wiki/category/admin",
    tokenColor: "orange",
  },
];

export const AUDIENCE_BY_ID = Object.fromEntries(
  AUDIENCES.map((audience) => [audience.id, audience]),
) as Record<WikiAudienceMeta["id"], WikiAudienceMeta>;

export function audienceColor(audience: WikiAudience): TokenColor {
  return AUDIENCE_BY_ID[audience].tokenColor;
}
