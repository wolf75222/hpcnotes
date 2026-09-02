import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { LeaderRow } from "@/components/leader-row";
import { getPlaylists } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Ordered reading lists of notes on hpcnotes.eu.",
};

export default function PlaylistsPage() {
  const playlists = getPlaylists();

  return (
    <VStack gap={8}>
      <PageHeading
        title="Playlists"
        summary="Ordered reading lists — a group of notes with a beginning, not a dump of tags."
        trail={[
          { href: "/", label: "notes" },
          { label: "playlists", current: true },
        ]}
      />
      <VStack gap={5}>
        {playlists.map((playlist) => (
          <LeaderRow
            key={playlist.slug}
            href={`/playlists/${playlist.slug}`}
            label={playlist.title}
            meta={`${String(playlist.slugs.length).padStart(2, "0")} notes`}
            extra={<Text color="secondary">{playlist.summary}</Text>}
          />
        ))}
      </VStack>
    </VStack>
  );
}
