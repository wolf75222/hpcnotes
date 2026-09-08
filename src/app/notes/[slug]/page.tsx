import type { Metadata } from "next";
import { NoteArticle } from "@/components/note-article";
import { MissingPost } from "@/components/missing-post";
import { getNoteBySlug, getNotes, toNoteIndex } from "@/content/load-notes";
import { getRelatedNotes } from "@/content/catalog";
import {
  buildThoughtForest,
  findThoughtPath,
  flattenThoughtRefs,
  thoughtNeighbors,
} from "@/content/thoughts";
import { formatReadingTime, readingMinutes } from "@/lib/reading-time";
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
  const note = getNoteBySlug(slug);
  if (note == null) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  return { title: note.title, description: note.summary };
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
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (note == null) {
    return <MissingPost />;
  }

  const forest = buildThoughtForest(getNotes().map(toNoteIndex));
  const path = findThoughtPath(forest, note.slug);
  const current = path?.[path.length - 1] ?? null;
  const parent =
    path != null && path.length > 1 ? (path[path.length - 2]?.note ?? null) : null;
  const childrenNotes = current?.children.map((child) => child.note) ?? [];
  const thoughts = path?.[0] != null ? flattenThoughtRefs(path[0]) : [];
  const { previous, next } = thoughtNeighbors(path);
  const readingLabel =
    current != null && current.children.length > 0
      ? `${minutesForTree(current)} min`
      : formatReadingTime(note.body);

  return (
    <>
      {note.body.includes("```mermaid") ? (
        <link rel="preload" href="/vendor/mermaid.min.js" as="script" />
      ) : null}
      <NoteArticle
        note={note}
        related={getRelatedNotes(note.slug).map(toNoteIndex)}
        parent={parent}
        childrenNotes={childrenNotes}
        previous={previous}
        next={next}
        thoughts={thoughts}
        readingLabel={readingLabel}
      />
    </>
  );
}
