const FALLBACK = "https://hpcnotes.eu";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK;
  return raw.replace(/\/+$/, "");
}
