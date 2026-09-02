import type { Note, Playlist } from "./types";
import { getNotes, NOTES_BY_SLUG } from "./notes";
import { PLAYLISTS } from "./playlists";

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

export function getPlaylistNotes(playlist: Playlist): Note[] {
  return playlist.slugs
    .map((slug) => NOTES_BY_SLUG[slug])
    .filter((note): note is Note => note != null);
}

export function getPlaylists() {
  return PLAYLISTS;
}

export function getPlaylistsForNote(slug: string) {
  return PLAYLISTS.filter((playlist) => playlist.slugs.includes(slug));
}

export function getRelatedNotes(slug: string, limit = 4) {
  const note = NOTES_BY_SLUG[slug];
  if (note == null) {
    return [];
  }
  const tags = new Set(note.tags);
  return getNotes()
    .filter(
      (candidate) =>
        candidate.slug !== slug &&
        candidate.tags.some((tag) => tags.has(tag)),
    )
    .slice(0, limit);
}

export function filterNotes(notes: Note[], query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return notes;
  }
  return notes.filter((note) => {
    const hay = [note.title, note.summary, note.body, note.tags.join(" ")]
      .join("\n")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function searchNotes(query: string) {
  return filterNotes(getNotes(), query);
}

export function searchPlaylists(query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return [];
  }
  return PLAYLISTS.filter((playlist) => {
    const hay = [playlist.title, playlist.summary, playlist.slug]
      .join("\n")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function notesByYear(notes: Note[]) {
  const groups: { year: string; notes: Note[] }[] = [];
  for (const note of notes) {
    const year = note.date.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.notes.push(note);
    } else {
      groups.push({ year, notes: [note] });
    }
  }
  return groups;
}
