import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { NoteArticle } from "@/components/note-article";
import { getNoteBySlug, getNotes, toNoteIndex } from "@/content/load-notes";
import { getRelatedNotes } from "@/content/catalog";
import {
  buildThoughtForest,
  findThoughtPath,
  noteContents,
  thoughtNeighbors,
} from "@/content/thoughts";
import { formatReadingTime, readingMinutes } from "@/lib/reading-time";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";
import type { ThoughtNode } from "@/content/types";

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(safeDecodeParam(slug));
  if (note == null) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  const description = note.summary.trim() || note.title;
  return {
    title: note.title,
    description,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description,
      publishedTime: note.date,
      tags: note.tags,
    },
  };
}

function minutesForTree(node: ThoughtNode): number {
  const full = getNoteBySlug(node.note.slug);
  const self = readingMinutes(full?.body ?? "");
  return node.children.reduce((sum, child) => sum + minutesForTree(child), self);
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: raw } = await params;
  const slug = safeDecodeParam(raw);
  if (!isNoteSlug(slug)) {
    notFound();
  }
  const note = getNoteBySlug(slug);
  if (note == null) {
    notFound();
  }

  const forest = buildThoughtForest(getNotes().map(toNoteIndex));
  const path = findThoughtPath(forest, note.slug);
  const current = path?.[path.length - 1] ?? null;
  const ancestors =
    path != null && path.length > 1
      ? path.slice(0, -1).map((node) => node.note)
      : [];
  const contents = noteContents(path);
  const { previous, next } = thoughtNeighbors(path);
  const readingLabel =
    current != null && current.children.length > 0
      ? `${minutesForTree(current)} min`
      : formatReadingTime(note.body);

  if (note.body.includes("```mermaid")) {
    preload("/vendor/mermaid.min.js", { as: "script" });
  }

  return (
    <NoteArticle
      note={note}
      related={getRelatedNotes(note.slug).map(toNoteIndex)}
      ancestors={ancestors}
      contents={contents}
      previous={previous}
      next={next}
      readingLabel={readingLabel}
    />
  );
}
