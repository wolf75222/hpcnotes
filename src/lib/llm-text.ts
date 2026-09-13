import { getNoteSource, getNotes, getThoughtForest } from "@/content/load-notes";
import { splitHomeLists } from "@/content/thoughts";
import type { Note } from "@/content/types";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
  noteMarkdownUrl,
  noteUrl,
} from "@/lib/site-url";

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function mdName(title: string) {
  return title.replaceAll("[", "").replaceAll("]", "").replaceAll("\n", " ");
}

function listItem(note: Note, extra?: string) {
  const summary = oneLine(note.summary);
  const detail = extra
    ? extra
    : summary === ""
      ? undefined
      : summary;
  const label = mdName(note.title);
  const url = noteMarkdownUrl(note.slug);
  return detail == null || detail === ""
    ? `- [${label}](${url})`
    : `- [${label}](${url}): ${detail}`;
}

export function buildLlmsTxt() {
  const site = getSiteUrl();
  const { notes, thoughts } = splitHomeLists(getThoughtForest());
  const children = getNotes().filter((note) => note.parent != null);
  const bySlug = new Map(getNotes().map((note) => [note.slug, note]));

  const noteLines = notes.map((note) => {
    const full = bySlug.get(note.slug);
    return full != null ? listItem(full) : `- [${mdName(note.title)}](${noteMarkdownUrl(note.slug)})`;
  });
  const thoughtLines = thoughts.map((note) => {
    const full = bySlug.get(note.slug);
    return full != null ? listItem(full) : `- [${mdName(note.title)}](${noteMarkdownUrl(note.slug)})`;
  });
  const pageLines = children.map((note) => {
    const parent = note.parent != null ? bySlug.get(note.parent) : undefined;
    const extra =
      parent != null
        ? `page of ${oneLine(parent.title)}`
        : oneLine(note.summary);
    return listItem(note, extra);
  });

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} Personal notes by hpcnotes. Cite the canonical HTML URL on ${site} when quoting.

This is a small notes site, not a cluster's official documentation. Each page has a Markdown copy at the same path with \`.md\` appended. Agents may also send \`Accept: text/markdown\` to the HTML URL. Prefer those Markdown files when quoting; the canonical citation is still the HTML page.

## Notes
${noteLines.join("\n") || "- None published."}

## Thoughts
${thoughtLines.join("\n") || "- None published."}

## Pages
${pageLines.join("\n") || "- No nested pages."}

## Optional
- [Full text](${absoluteUrl("/llms-full.txt")}): every published note in one Markdown file
- [Sitemap](${absoluteUrl("/sitemap.xml")})
- [RSS](${absoluteUrl("/feed.xml")}): listed notes and thoughts only
- [Explore](${absoluteUrl("/explore")}): tags
`;
}

export function buildLlmsFullTxt() {
  const site = getSiteUrl();
  const notes = getNotes();
  const parts = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Canonical site: ${site}. Cite each note's HTML URL, not this combined file.`,
    "",
  ];

  for (const note of notes) {
    const source = getNoteSource(note.slug);
    if (source == null) {
      continue;
    }
    parts.push(`<!-- ${noteUrl(note.slug)} -->`);
    parts.push(source.trimEnd());
    parts.push("");
  }

  return `${parts.join("\n").trimEnd()}\n`;
}
