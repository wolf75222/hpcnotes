import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { NoteList } from "@/components/note-list";
import { EmptyNotes } from "@/components/empty-notes";
import { getPlaylistNotes } from "@/content/catalog";
import { PLAYLISTS, PLAYLISTS_BY_SLUG } from "@/content/playlists";

export function generateStaticParams() {
  return PLAYLISTS.map((playlist) => ({ slug: playlist.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const playlist = PLAYLISTS_BY_SLUG[slug];
  if (playlist == null) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  return { title: playlist.title, description: playlist.summary };
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playlist = PLAYLISTS_BY_SLUG[slug];

  if (playlist == null) {
    return (
      <VStack gap={8}>
        <PageHeading
          title="That playlist is not here"
          trail={[
            { href: "/", label: "notes" },
            { href: "/playlists", label: "playlists" },
            { label: "missing", current: true },
          ]}
        />
        <EmptyNotes
          title="No reading list uses that slug"
          description="Playlists are ordered groups of notes."
          actionHref="/playlists"
          actionLabel="All playlists"
          headingLevel={2}
        />
      </VStack>
    );
  }

  const notes = getPlaylistNotes(playlist);

  return (
    <VStack gap={8}>
      <PageHeading
        title={playlist.title}
        summary={playlist.summary}
        trail={[
          { href: "/", label: "notes" },
          { href: "/playlists", label: "playlists" },
          { label: playlist.title, current: true },
        ]}
      />
      <NoteList notes={notes} numbered />
    </VStack>
  );
}
