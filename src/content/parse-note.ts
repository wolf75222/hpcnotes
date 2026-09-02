import type { Note } from "./types";

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseNoteMarkdown(slug: string, source: string): Note {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match == null) {
    throw new Error(`Note "${slug}" needs YAML front matter between --- lines.`);
  }

  const fields: Record<string, string> = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }
    const index = line.indexOf(":");
    if (index === -1) {
      continue;
    }
    fields[line.slice(0, index).trim()] = unquote(line.slice(index + 1));
  }

  const tags = (fields.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  return {
    slug,
    title: fields.title ?? slug,
    summary: fields.summary ?? "",
    date: fields.date ?? "1970-01-01",
    author: fields.author ?? "hpcnotes",
    tags,
    body: match[2].trim(),
  };
}
