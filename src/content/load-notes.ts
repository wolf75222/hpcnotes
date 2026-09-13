import fs from "node:fs";
import path from "node:path";
import { isNoteSlug } from "../lib/slugs";
import type { Note, NoteIndex, ThoughtNode } from "./types";
import { parseNoteMarkdown } from "./parse-note";
import { buildThoughtForest } from "./thoughts";

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
    if (!isNoteSlug(slug)) {
      console.warn(`Skipping ${name}: slug must be lowercase letters, numbers, and hyphens.`);
      continue;
    }
    const source = fs.readFileSync(path.join(NOTES_DIR, name), "utf8");
    try {
      notes.push(parseNoteMarkdown(slug, source));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (process.env.NODE_ENV === "production") {
        throw new Error(`${name}: ${message}`);
      }
      console.warn(`Skipping ${name}: ${message}`);
    }
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
    parent: note.parent,
    order: note.order,
    kind: note.kind,
  };
}

export function isListedNote(note: NoteIndex) {
  return note.parent == null;
}

interface Catalog {
  parsed: Note[];
  visible: Note[];
  bySlug: Map<string, Note>;
  forest: ThoughtNode[];
}

let productionCatalog: Catalog | null = null;

function buildCatalog(parsed: Note[]): Catalog {
  const visible = parsed.filter(isVisible).sort(byDateDesc);
  return {
    parsed,
    visible,
    bySlug: new Map(visible.map((note) => [note.slug, note])),
    forest: buildThoughtForest(visible.map(toNoteIndex)),
  };
}

function getCatalog(): Catalog {
  if (process.env.NODE_ENV === "production") {
    productionCatalog ??= buildCatalog(readNotesFromDisk());
    return productionCatalog;
  }
  return buildCatalog(readNotesFromDisk());
}

export function getAllParsedNotes() {
  return [...getCatalog().parsed].sort(byDateDesc);
}

export function getPublishedNotes() {
  return getAllParsedNotes().filter((note) => !note.draft);
}

export function getNotes() {
  return getCatalog().visible;
}

export function getListedNotes() {
  return getNotes().filter(isListedNote);
}

export function getNoteIndex() {
  return getNotes().map(toNoteIndex);
}

export function getThoughtForest() {
  return getCatalog().forest;
}

export function getNoteBySlug(slug: string) {
  if (!isNoteSlug(slug)) {
    return undefined;
  }
  return getCatalog().bySlug.get(slug);
}

export function getNoteSlugs() {
  return getNotes().map((note) => note.slug);
}

export function getNoteSource(slug: string) {
  if (getNoteBySlug(slug) == null) {
    return undefined;
  }
  const file = path.join(NOTES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) {
    return undefined;
  }
  return fs.readFileSync(file, "utf8");
}
