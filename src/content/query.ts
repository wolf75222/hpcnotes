import type { NoteIndex } from "./types";
import { noteYear } from "../lib/dates";

export const SEARCH_LIMIT = 24;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldHas(hay: string, part: string) {
  if (part.length <= 2) {
    return new RegExp(
      `(^|[^a-z0-9#])${escapeRegExp(part)}([^a-z0-9]|$)`,
    ).test(hay);
  }
  return hay.includes(part);
}

export interface SearchHit {
  note: NoteIndex;
  /** Excerpt around the first body match, when the note matched on its body. */
  snippet?: string;
}

const SNIPPET_RADIUS = 70;

function snippetAround(body: string, lowerBody: string, part: string) {
  const at = lowerBody.indexOf(part);
  if (at < 0) {
    return undefined;
  }
  let start = Math.max(0, at - SNIPPET_RADIUS);
  let end = Math.min(body.length, at + part.length + SNIPPET_RADIUS);
  // Snap to word boundaries so the excerpt never starts mid-word.
  if (start > 0) {
    const space = body.indexOf(" ", start);
    start = space >= 0 && space < at ? space + 1 : start;
  }
  if (end < body.length) {
    const space = body.lastIndexOf(" ", end);
    end = space > at + part.length ? space : end;
  }
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}

export function queryParts(query: string) {
  return query
    .trim()
    .toLowerCase()
    .slice(0, 120)
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 12);
}

/**
 * Rank notes for a query. Every word must appear in the title, a tag, the
 * summary or (when `bodies` is given) the body. Title and tag hits weigh most.
 */
export function searchNotes(
  notes: NoteIndex[],
  query: string,
  bodies?: Readonly<Record<string, string>>,
): SearchHit[] {
  const parts = queryParts(query);
  if (parts.length === 0) {
    return [];
  }

  const scored: { hit: SearchHit; score: number }[] = [];
  for (const note of notes) {
    const title = note.title.toLowerCase();
    const summary = note.summary.toLowerCase();
    const tagHay = note.tags.map((tag) => `#${tag}`).join(" ");
    const body = bodies?.[note.slug] ?? "";
    const lowerBody = body.toLowerCase();
    let score = 0;
    let ok = true;
    let snippet: string | undefined;
    let metaHit = false;
    for (const part of parts) {
      const inTitle = fieldHas(title, part);
      const inTags = fieldHas(tagHay, part);
      const inSummary = fieldHas(summary, part);
      const inBody = !inTitle && !inTags && !inSummary && body !== "" && fieldHas(lowerBody, part);
      if (!inTitle && !inTags && !inSummary && !inBody) {
        ok = false;
        break;
      }
      if (title === part || title.startsWith(part)) {
        score += 8;
      } else if (inTitle) {
        score += 4;
      } else if (inTags) {
        score += 3;
      } else if (inSummary) {
        score += 1;
      } else {
        score += 0.5;
        snippet ??= snippetAround(body, lowerBody, part);
      }
      if (!inBody) {
        metaHit = true;
      }
    }
    if (ok) {
      scored.push({
        hit: metaHit && note.summary !== "" ? { note } : { note, snippet },
        score,
      });
    }
  }

  scored.sort(
    (a, b) => b.score - a.score || b.hit.note.date.localeCompare(a.hit.note.date),
  );
  return scored.slice(0, SEARCH_LIMIT).map((item) => item.hit);
}

export function filterNotes(notes: NoteIndex[], query: string) {
  return searchNotes(notes, query).map((hit) => hit.note);
}

export function notesByYear(notes: NoteIndex[]) {
  const groups: { year: string; notes: NoteIndex[] }[] = [];
  for (const note of notes) {
    const year = noteYear(note.date);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.notes.push(note);
    } else {
      groups.push({ year, notes: [note] });
    }
  }
  return groups;
}
