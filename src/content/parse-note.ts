import type { Note } from "./types";

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length >= 2)
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseDraft(value: string | undefined) {
  if (value == null || value.trim() === "") {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1";
}

function splitTagString(raw: string) {
  let value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    value = value.slice(1, -1);
  }
  return value.split(",").map((item) => unquote(item.trim()));
}

function parseTags(value: string | string[] | undefined) {
  const parts = Array.isArray(value)
    ? value
    : value == null
      ? []
      : splitTagString(value);
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const tag = part.trim();
    if (tag === "" || seen.has(tag)) {
      continue;
    }
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

function parseFrontMatter(block: string) {
  const fields: Record<string, string | string[]> = {};
  let listKey: string | null = null;

  for (const rawLine of block.split("\n")) {
    const trimmed = rawLine.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    if (trimmed.startsWith("- ") && listKey != null) {
      const item = unquote(trimmed.slice(2));
      const current = fields[listKey];
      const list = Array.isArray(current)
        ? current
        : current != null && current !== ""
          ? [current]
          : [];
      list.push(item);
      fields[listKey] = list;
      continue;
    }

    const index = trimmed.indexOf(":");
    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    if (key === "") {
      continue;
    }
    listKey = key;
    fields[key] = unquote(trimmed.slice(index + 1));
  }

  return fields;
}

export function parseNoteMarkdown(slug: string, source: string): Note {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match == null) {
    throw new Error(`Note "${slug}" needs YAML front matter between --- lines.`);
  }

  const fields = parseFrontMatter(match[1] ?? "");
  const title = typeof fields.title === "string" ? fields.title.trim() : "";
  if (title === "") {
    throw new Error(`Note "${slug}" is missing a title.`);
  }

  const date = typeof fields.date === "string" ? fields.date.trim() : "";
  if (date === "") {
    throw new Error(`Note "${slug}" is missing a date.`);
  }

  const summary = typeof fields.summary === "string" ? fields.summary : "";
  const authorRaw = typeof fields.author === "string" ? fields.author.trim() : "";
  const draftRaw = typeof fields.draft === "string" ? fields.draft : undefined;

  return {
    slug,
    title,
    summary,
    date,
    author: authorRaw === "" ? "hpcnotes" : authorRaw,
    tags: parseTags(fields.tags),
    draft: parseDraft(draftRaw),
    body: (match[2] ?? "").trim(),
  };
}
