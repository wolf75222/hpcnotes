const FALLBACK = "https://hpcnotes.eu";

export const SITE_NAME = "hpcnotes.eu";
export const SITE_DESCRIPTION =
  "Short notes on high-performance computing, and personal thoughts around HPC.";

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
