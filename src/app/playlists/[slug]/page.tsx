import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { NoteList } from "@/components/note-list";
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
      <VStack gap={2}>
        <PageHeading title="That playlist is not here" />
        <Text color="secondary">No reading list uses that slug.</Text>
        <Link href="/playlists" hasUnderline>
          All playlists
        </Link>
      </VStack>
    );
  }

  const notes = getPlaylistNotes(playlist);

  return (
    <VStack gap={8}>
      <PageHeading title={playlist.title} summary={playlist.summary} />
      <NoteList notes={notes} numbered />
    </VStack>
  );
}
