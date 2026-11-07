import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { NoteArticle } from "@/components/note-article";
import { JsonLd } from "@/components/json-ld";
import { getNoteBySlug, getNotes, getThoughtForest, toNoteIndex } from "@/content/load-notes";
import { getBacklinks, getRelatedNotes } from "@/content/catalog";
import { resolveWikiLinks } from "@/lib/markdown-text";
import {
  findThoughtPath,
  noteContents,
  thoughtNeighbors,
} from "@/content/thoughts";
import { noteJsonLd } from "@/lib/json-ld";
import { notePageMetadata } from "@/lib/note-metadata";
import { notFoundMetadata } from "@/lib/page-metadata";
import { formatReadingTime } from "@/lib/reading-time";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";
import type { ThoughtNode } from "@/content/types";

export const dynamicParams = false;

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
    return notFoundMetadata();
  }
  const root = findThoughtPath(getThoughtForest(), note.slug)?.[0]?.note;
  return notePageMetadata(note, root?.title);
}

function treeBody(node: ThoughtNode): string {
  const self = getNoteBySlug(node.note.slug)?.body ?? "";
  return [self, ...node.children.map(treeBody)].join("\n");
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

  const forest = getThoughtForest();
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
      ? formatReadingTime(treeBody(current))
      : formatReadingTime(note.body);

  const body = resolveWikiLinks(note.body, (target) => {
    const hit = getNoteBySlug(target);
    return hit == null ? undefined : { title: hit.title };
  });
  const related = getRelatedNotes(note.slug).map(toNoteIndex);
  const backlinks = getBacklinks(note.slug, [
    ...ancestors.map((item) => item.slug),
    ...(current?.children.map((child) => child.note.slug) ?? []),
    ...related.map((item) => item.slug),
  ]).map(toNoteIndex);

  if (note.body.includes("```mermaid")) {
    preload("/vendor/mermaid.min.js", { as: "script" });
  }

  return (
    <>
      <JsonLd data={noteJsonLd(note, ancestors)} />
      <NoteArticle
        note={note}
        body={body}
        related={related}
        backlinks={backlinks}
        ancestors={ancestors}
        contents={contents}
        previous={previous}
        next={next}
        readingLabel={readingLabel}
      />
    </>
  );
}
