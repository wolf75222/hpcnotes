import { getSiteUrl } from "./site-url";

const DANGEROUS = /^(javascript|data|vbscript):/i;

export function markdownLinkProps(href: string): {
  href: string;
  target?: string;
  rel?: string;
} | null {
  const trimmed = href.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (trimmed === "" || DANGEROUS.test(trimmed)) {
    return null;
  }

  if (trimmed.startsWith("#") || trimmed.startsWith("mailto:")) {
    return { href: trimmed };
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return { href: trimmed };
  }

  try {
    const site = new URL(getSiteUrl());
    const url = new URL(trimmed, site);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    if (url.origin === site.origin) {
      return { href: `${url.pathname}${url.search}${url.hash}` };
    }
    return {
      href: url.toString(),
      target: "_blank",
      rel: "noopener noreferrer",
    };
  } catch {
    return null;
  }
}
