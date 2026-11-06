import { describe, expect, it } from "vitest";
import { parseNoteMarkdown } from "./parse-note";
import { searchNotes } from "./query";
import { buildThoughtForest } from "./thoughts";
import type { NoteIndex } from "./types";

describe("parseNoteMarkdown", () => {
  it("reads front matter, lists and defaults", () => {
    const note = parseNoteMarkdown(
      "x",
      '﻿---\r\ntitle: "A: B"\r\ndate: 2026-01-02\r\ntags:\r\n  - MPI\r\n  - mpi\r\n  - bad tag\r\n---\r\nBody',
    );
    expect(note.title).toBe("A: B");
    expect(note.tags).toEqual(["mpi"]);
    expect(note.author).toBe("hpcnotes");
    expect(note.kind).toBe("thought");
    expect(note.updated).toBeNull();
    expect(note.body).toBe("Body");
  });

  it("accepts a file with front matter only", () => {
    expect(parseNoteMarkdown("x", "---\ntitle: T\ndate: 2026-01-02\n---").body).toBe("");
  });

  it("does not turn a scalar into a list", () => {
    const note = parseNoteMarkdown(
      "x",
      "---\ntitle: T\ndate: 2026-01-02\nsummary: S\n- stray\n---\n",
    );
    expect(note.summary).toBe("S");
  });

  it("validates dates", () => {
    expect(() => parseNoteMarkdown("x", "---\ntitle: T\ndate: 2026-02-30\n---\n")).toThrow();
    expect(() =>
      parseNoteMarkdown("x", "---\ntitle: T\ndate: 2026-01-02\nupdated: soon\n---\n"),
    ).toThrow();
    expect(
      parseNoteMarkdown("x", "---\ntitle: T\ndate: 2026-01-02\nupdated: 2026-03-01\n---\n").updated,
    ).toBe("2026-03-01");
  });

  it("ignores a parent pointing at itself", () => {
    expect(parseNoteMarkdown("x", "---\ntitle: T\ndate: 2026-01-02\nparent: x\n---\n").parent).toBeNull();
  });
});

function index(slug: string, extra: Partial<NoteIndex> = {}): NoteIndex {
  return {
    slug,
    title: slug,
    summary: "",
    date: "2026-01-01",
    updated: null,
    author: "a",
    tags: [],
    draft: false,
    parent: null,
    order: 0,
    kind: "thought",
    ...extra,
  };
}

describe("searchNotes", () => {
  const notes = [
    index("mpi-basics", { title: "MPI basics", tags: ["mpi"] }),
    index("caches", { title: "Caches", summary: "Lines and sets" }),
  ];

  it("ranks title hits and needs every word", () => {
    expect(searchNotes(notes, "mpi").map((h) => h.note.slug)).toEqual(["mpi-basics"]);
    expect(searchNotes(notes, "mpi caches")).toEqual([]);
  });

  it("falls back to bodies with a snippet", () => {
    const hits = searchNotes(notes, "associativity", {
      caches: "Set associativity decides where a line can live.",
    });
    expect(hits).toHaveLength(1);
    expect(hits[0]?.snippet).toContain("associativity");
  });
});

describe("buildThoughtForest", () => {
  it("survives parent cycles", () => {
    const forest = buildThoughtForest([
      index("a", { parent: "b" }),
      index("b", { parent: "a" }),
    ]);
    const count = (nodes: typeof forest): number =>
      nodes.reduce((sum, node) => sum + 1 + count(node.children), 0);
    expect(count(forest)).toBe(2);
  });
});
