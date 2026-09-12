import { normalizeTag } from "../lib/slugs";
import {
  getListedNotes,
  getNoteBySlug,
  getNotes,
  getThoughtForest,
  isListedNote,
} from "./load-notes";
import { PLAYLISTS } from "./playlists";
import { isIsoDate } from "../lib/dates";
import { findThoughtPath } from "./thoughts";
import type { Note } from "./types";

export { filterNotes, notesByYear } from "./query";

function hasTag(note: { tags: string[] }, needle: string) {
  return note.tags.some((item) => item === needle);
}

export function getNotesByTag(tag: string) {
  const needle = normalizeTag(tag);
  const notes = getNotes();
  const tagged = new Set(
    notes.filter((note) => hasTag(note, needle)).map((note) => note.slug),
  );
  return notes.filter((note) => {
    if (!hasTag(note, needle)) {
      return false;
    }
    if (note.parent != null && tagged.has(note.parent)) {
      return false;
    }
    return true;
  });
}

export function getNotesByYear(year: string) {
  return getListedNotes().filter((note) => note.date.startsWith(`${year}-`));
}

export function getTags(): { tag: string; count: number }[] {
  const notes = getNotes();
  const taggedBy = new Map<string, Set<string>>();
  for (const note of notes) {
    for (const tag of note.tags) {
      const slugs = taggedBy.get(tag) ?? new Set<string>();
      slugs.add(note.slug);
      taggedBy.set(tag, slugs);
    }
  }
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.tags) {
      const slugs = taggedBy.get(tag);
      if (note.parent != null && slugs?.has(note.parent)) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getYears(): { year: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of getListedNotes()) {
    if (!isIsoDate(note.date)) {
      continue;
    }
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

  const path = findThoughtPath(getThoughtForest(), slug);
  const seen = new Set<string>([slug]);
  const related: Note[] = [];

  function push(candidateSlug: string) {
    if (related.length >= limit || seen.has(candidateSlug)) {
      return;
    }
    const match = getNoteBySlug(candidateSlug);
    if (match == null) {
      return;
    }
    seen.add(candidateSlug);
    related.push(match);
  }

  const parent = path != null && path.length > 1 ? path[path.length - 2] : null;
  if (parent != null) {
    for (const sibling of parent.children) {
      push(sibling.note.slug);
      if (related.length >= limit) {
        return related;
      }
    }
  }

  for (const playlist of PLAYLISTS) {
    if (!playlist.slugs.includes(slug)) {
      continue;
    }
    for (const other of playlist.slugs) {
      push(other);
      if (related.length >= limit) {
        return related;
      }
    }
  }

  const tags = new Set(note.tags.map(normalizeTag));
  for (const candidate of getNotes()) {
    if (!isListedNote(candidate)) {
      continue;
    }
    if (!candidate.tags.some((tag) => tags.has(normalizeTag(tag)))) {
      continue;
    }
    push(candidate.slug);
    if (related.length >= limit) {
      return related;
    }
  }

  return related;
}
