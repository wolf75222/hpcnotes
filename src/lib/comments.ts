/**
 * giscus: comments stored as GitHub Discussions on this repository.
 * These IDs are public (they appear in every page); they are not secrets.
 * Readers sign in with GitHub on giscus.app, never on this site.
 */
export const GISCUS = {
  repo: "wolf75222/hpcnotes",
  repoId: "R_kgDOVHjv9Q",
  // "Announcements": only maintainers and the giscus app can open
  // discussions, so nobody can create threads that bypass the site.
  category: "Announcements",
  categoryId: "DIC_kwDOVHjv9c4DKjnc",
} as const;

export const GISCUS_ORIGIN = "https://giscus.app";

export function commentsEnabled() {
  return process.env.NEXT_PUBLIC_COMMENTS !== "off";
}
