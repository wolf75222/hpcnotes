import { isNoteSlug } from "./slugs";

const CODE = /```[\s\S]*?```|~~~[\s\S]*?~~~|``[\s\S]*?``|`[^`\n]+`/g;

/**
 * Apply `transform` to every part of `source` that is not code (fenced or
 * inline). An unclosed fence protects everything after it, like Markdown does.
 */
export function mapOutsideCode(
  source: string,
  transform: (text: string) => string,
) {
  const parts: string[] = [];
  let last = 0;
  for (const match of source.matchAll(CODE)) {
    const index = match.index ?? 0;
    parts.push(transform(source.slice(last, index)));
    parts.push(match[0]);
    last = index + match[0].length;
  }
  const rest = source.slice(last);
  const opener = rest.search(/```|~~~/);
  if (opener >= 0) {
    parts.push(transform(rest.slice(0, opener)));
    parts.push(rest.slice(opener));
  } else {
    parts.push(transform(rest));
  }
  return parts.join("");
}

/** `[[slug]]`, `[[slug|label]]`, `[[slug#anchor]]`, `[[slug#anchor|label]]`. */
const WIKI_LINK = /\[\[([a-z0-9-]+)(#[A-Za-z0-9_-]+)?(?:\|([^\]\n]{1,200}))?\]\]/g;

export interface WikiTarget {
  title: string;
}

function escapeLinkText(value: string) {
  return value.replace(/([\\[\]])/g, "\\$1");
}

/**
 * Rewrite wiki-links into regular Markdown links. Unknown targets render as
 * their label in plain text so a typo never produces a dead link.
 */
export function resolveWikiLinks(
  source: string,
  lookup: (slug: string) => WikiTarget | undefined,
) {
  return mapOutsideCode(source, (text) =>
    text.replace(
      WIKI_LINK,
      (whole, slug: string, anchor: string | undefined, label?: string) => {
        if (!isNoteSlug(slug)) {
          return whole;
        }
        const target = lookup(slug);
        const text = label?.trim() || target?.title || slug;
        if (target == null) {
          return escapeLinkText(text);
        }
        return `[${escapeLinkText(text)}](/notes/${slug}${anchor ?? ""})`;
      },
    ),
  );
}

const NOTE_HREF = /\]\(\s*<?\/notes\/([a-z0-9-]+)(?:\.md)?(?:[#?][^)\s>]*)?>?(?:\s+"[^"]*")?\s*\)/g;

/** Every note slug a body links to, through `/notes/…` links or wiki-links. */
export function linkedNoteSlugs(source: string): string[] {
  const found = new Set<string>();
  mapOutsideCode(source, (text) => {
    for (const match of text.matchAll(NOTE_HREF)) {
      if (match[1] != null && isNoteSlug(match[1])) {
        found.add(match[1]);
      }
    }
    for (const match of text.matchAll(WIKI_LINK)) {
      if (match[1] != null && isNoteSlug(match[1])) {
        found.add(match[1]);
      }
    }
    return text;
  });
  return [...found];
}

/** `/media/…` paths referenced by a body (images, gifs, videos). */
export function referencedMedia(source: string): string[] {
  const found = new Set<string>();
  mapOutsideCode(source, (text) => {
    for (const match of text.matchAll(/\]\(\s*<?(\/media\/[^)\s>]+)/g)) {
      if (match[1] != null) {
        found.add(match[1]);
      }
    }
    return text;
  });
  return [...found];
}

/** Rough plain text for search: keeps words and code, drops Markdown syntax. */
export function markdownPlainText(source: string, limit = 20_000) {
  return source
    .replace(/^(```|~~~)[^\n]*$/gm, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([a-z0-9-]+)(?:#[^|\]]*)?(?:\|([^\]]*))?\]\]/g, (_, slug, label) => label ?? slug)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}
