import fs from "node:fs";
import path from "node:path";
import type { Note, NoteIndex } from "./types";
import { parseNoteMarkdown } from "./parse-note";

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

function readNotesFromDisk(): Note[] {
  if (!fs.existsSync(NOTES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(NOTES_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();

  const notes: Note[] = [];
  for (const name of files) {
    const slug = name.slice(0, -3);
    const source = fs.readFileSync(path.join(NOTES_DIR, name), "utf8");
    try {
      notes.push(parseNoteMarkdown(slug, source));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skipping ${name}: ${message}`);
    }
  }
  return notes;
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

function byDateDesc(a: NoteIndex, b: NoteIndex) {
  return b.date.localeCompare(a.date);
}

function isVisible(note: Note) {
  return process.env.NODE_ENV === "development" || !note.draft;
}

export function toNoteIndex(note: Note): NoteIndex {
  return {
    slug: note.slug,
    title: note.title,
    summary: note.summary,
    date: note.date,
    author: note.author,
    tags: note.tags,
    draft: note.draft,
  };
}

export function getAllParsedNotes() {
  return [...loadNotes()].sort(byDateDesc);
}

export function getPublishedNotes() {
  return getAllParsedNotes().filter((note) => !note.draft);
}

export function getNotes() {
  return getAllParsedNotes().filter(isVisible);
}

export function getNoteIndex() {
  return getNotes().map(toNoteIndex);
}

export function getNoteBySlug(slug: string) {
  return getNotes().find((note) => note.slug === slug);
}

export function getNoteSlugs() {
  return getNotes().map((note) => note.slug);
}
