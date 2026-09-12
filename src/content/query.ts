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

export function filterNotes(notes: NoteIndex[], query: string) {
  const parts = query
    .trim()
    .toLowerCase()
    .slice(0, 120)
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) {
    return [];
  }

  const scored: { note: NoteIndex; score: number }[] = [];
  for (const note of notes) {
    const title = note.title.toLowerCase();
    const summary = note.summary.toLowerCase();
    const tagHay = note.tags.map((tag) => `#${tag}`).join(" ");
    let score = 0;
    let ok = true;
    for (const part of parts) {
      const inTitle = fieldHas(title, part);
      const inTags = fieldHas(tagHay, part);
      const inSummary = fieldHas(summary, part);
      if (!inTitle && !inTags && !inSummary) {
        ok = false;
        break;
      }
      if (title === part || title.startsWith(`${part} `) || title.startsWith(part)) {
        score += 8;
      } else if (inTitle) {
        score += 4;
      } else if (inTags) {
        score += 3;
      } else {
        score += 1;
      }
    }
    if (ok) {
      scored.push({ note, score });
    }
  }

  scored.sort(
    (a, b) => b.score - a.score || b.note.date.localeCompare(a.note.date),
  );
  return scored.slice(0, SEARCH_LIMIT).map((item) => item.note);
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
