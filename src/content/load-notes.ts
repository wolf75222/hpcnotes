import fs from "node:fs";
import path from "node:path";
import type { Note } from "./types";
import { parseNoteMarkdown } from "./parse-note";

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

function readNotesFromDisk(): Note[] {
  const files = fs
    .readdirSync(NOTES_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();

  return files.map((name) => {
    const slug = name.slice(0, -3);
    const source = fs.readFileSync(path.join(NOTES_DIR, name), "utf8");
    return parseNoteMarkdown(slug, source);
  });
}

let productionCache: Note[] | null = null;

function loadNotes(): Note[] {
  if (process.env.NODE_ENV === "production" && productionCache != null) {
    return productionCache;
  }
  const notes = readNotesFromDisk();
  if (process.env.NODE_ENV === "production") {
    productionCache = notes;
  }
  return notes;
}

export function getNotes() {
  return [...loadNotes()].sort((a, b) => b.date.localeCompare(a.date));
}

export function getNoteBySlug(slug: string) {
  return loadNotes().find((note) => note.slug === slug);
}

export function getNoteSlugs() {
  return loadNotes().map((note) => note.slug);
}
