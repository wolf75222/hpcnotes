const FALLBACK = "https://hpcnotes.eu";

export const SITE_NAME = "hpcnotes.eu";
export const SITE_DESCRIPTION =
  "HPC notes and wiki: high-performance computing and performance engineering, from CPU caches, SIMD and compilers to MPI, OpenMP, CUDA and Slurm clusters.";

/** Phrases people search for; used in metadata and structured data. */
export const SITE_KEYWORDS = [
  "HPC notes",
  "HPC wiki",
  "HPC performance",
  "high-performance computing",
  "performance engineering",
  "HPC tutorial",
  "CPU cache",
  "SIMD",
  "vectorization",
  "MPI",
  "OpenMP",
  "CUDA",
  "Slurm",
  "HPC cluster",
  "parallel computing",
];

export const SITE_ALT_NAMES = ["HPC Notes", "hpcnotes", "HPC wiki"];

function originFrom(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("unsupported protocol");
  }
  return url.origin;
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK;
  try {
    return originFrom(raw);
  } catch {
    return FALLBACK;
  }
}

export function absoluteUrl(path = "/") {
  const site = getSiteUrl();
  if (path === "" || path === "/") {
    return site;
  }
  return `${site}${path.startsWith("/") ? path : `/${path}`}`;
}

export function noteUrl(slug: string) {
  return absoluteUrl(`/notes/${slug}`);
}

export function noteMarkdownUrl(slug: string) {
  return absoluteUrl(`/notes/${slug}.md`);
}
