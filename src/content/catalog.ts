import { getNoteBySlug, getNotes } from "./load-notes";
import { PLAYLISTS } from "./playlists";
import { filterNotes } from "./query";
import type { Note } from "./types";

export { filterNotes, notesByYear } from "./query";

export function getNotesByTag(tag: string) {
  const needle = tag.toLowerCase();
  return getNotes().filter((note) =>
    note.tags.some((item) => item.toLowerCase() === needle),
  );
}

export function getNotesByYear(year: string) {
  return getNotes().filter((note) => note.date.startsWith(`${year}-`));
}

export function getTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of getNotes()) {
    for (const tag of note.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getYears(): { year: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of getNotes()) {
    const year = note.date.slice(0, 4);
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function getRelatedNotes(slug: string, limit = 5) {
  const note = getNoteBySlug(slug);
  if (note == null) {
    return [];
  }

  const seen = new Set<string>([slug]);
  const related: Note[] = [];

  for (const playlist of PLAYLISTS) {
    if (!playlist.slugs.includes(slug)) {
      continue;
    }
    for (const other of playlist.slugs) {
      if (seen.has(other)) {
        continue;
      }
      const match = getNoteBySlug(other);
      if (match == null) {
        continue;
      }
      seen.add(other);
      related.push(match);
      if (related.length >= limit) {
        return related;
      }
    }
  }

  const tags = new Set(note.tags);
  for (const candidate of getNotes()) {
    if (seen.has(candidate.slug)) {
      continue;
    }
    if (!candidate.tags.some((tag) => tags.has(tag))) {
      continue;
    }
    seen.add(candidate.slug);
    related.push(candidate);
    if (related.length >= limit) {
      return related;
    }
  }

  return related;
}

export function searchNotes(query: string) {
  return filterNotes(getNotes(), query);
}
