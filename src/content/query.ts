import type { Note } from "./types";
import { PLAYLISTS } from "./playlists";

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
