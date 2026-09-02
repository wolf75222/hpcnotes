import type { Metadata } from "next";
import { NoteArticle } from "@/components/note-article";
import { MissingPost } from "@/components/missing-post";
import { getNotes, NOTES_BY_SLUG } from "@/content/notes";
import { getPlaylistsForNote, getRelatedNotes } from "@/content/catalog";

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES_BY_SLUG[slug];
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
  const note = NOTES_BY_SLUG[slug];
  if (note == null) {
    return <MissingPost />;
  }

  return (
    <NoteArticle
      note={note}
      related={getRelatedNotes(note.slug)}
      playlists={getPlaylistsForNote(note.slug)}
    />
  );
}
