const FALLBACK = "https://hpcnotes.eu";

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
