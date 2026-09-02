import type { Metadata } from "next";
import { NoteArticle } from "@/components/note-article";
import { MissingPost } from "@/components/missing-post";
import { getNoteBySlug, getNotes } from "@/content/load-notes";
import { getRelatedNotes } from "@/content/catalog";

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

  return (
    <>
      {note.body.includes("```mermaid") ? (
        <link rel="preload" href="/vendor/mermaid.min.js" as="script" />
      ) : null}
      <NoteArticle note={note} related={getRelatedNotes(note.slug)} />
    </>
  );
}
