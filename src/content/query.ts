import type { NoteIndex } from "./types";
import { noteYear } from "../lib/dates";

export function filterNotes(notes: NoteIndex[], query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return [];
  }
  return notes.filter((note) => {
    const hay = [note.title, note.summary, note.tags.map((tag) => `#${tag}`).join(" ")]
      .join("\n")
      .toLowerCase();
    return hay.includes(needle);
  });
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
