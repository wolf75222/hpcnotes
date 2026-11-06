import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllParsedNotes } from "./load-notes";
import { PLAYLISTS } from "./playlists";
import { linkedNoteSlugs, referencedMedia } from "../lib/markdown-text";

/** Guards the Markdown in src/content/notes: run with `npm test`. */
describe("content", () => {
  const notes = getAllParsedNotes();
  const slugs = new Set(notes.map((note) => note.slug));
  const files = fs
    .readdirSync(path.join(process.cwd(), "src/content/notes"))
    .filter((name) => name.endsWith(".md"));

  it("parses every note", () => {
    expect(notes.length).toBe(files.length);
  });

  it("has no broken note links", () => {
    const broken = notes.flatMap((note) =>
      linkedNoteSlugs(note.body)
        .filter((target) => !slugs.has(target))
        .map((target) => `${note.slug} -> ${target}`),
    );
    expect(broken).toEqual([]);
  });

  it("has no missing media", () => {
    const missing = notes.flatMap((note) =>
      referencedMedia(note.body)
        .filter((src) => !fs.existsSync(path.join(process.cwd(), "public", src)))
        .map((src) => `${note.slug} -> ${src}`),
    );
    expect(missing).toEqual([]);
  });

  it("points parents at real notes", () => {
    const orphans = notes
      .filter((note) => note.parent != null && !slugs.has(note.parent))
      .map((note) => `${note.slug} -> ${note.parent}`);
    expect(orphans).toEqual([]);
  });

  it("has no parent cycles", () => {
    const bySlug = new Map(notes.map((note) => [note.slug, note]));
    const cyclic = notes.filter((note) => {
      const seen = new Set<string>();
      let cursor: string | null = note.slug;
      while (cursor != null) {
        if (seen.has(cursor)) return true;
        seen.add(cursor);
        cursor = bySlug.get(cursor)?.parent ?? null;
      }
      return false;
    });
    expect(cyclic.map((note) => note.slug)).toEqual([]);
  });

  it("only lists existing notes in playlists", () => {
    const missing = PLAYLISTS.flatMap((list) =>
      list.slugs.filter((slug) => !slugs.has(slug)).map((slug) => `${list.slug} -> ${slug}`),
    );
    expect(missing).toEqual([]);
  });
});
