import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { SearchNotes } from "@/components/search-notes";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: "Search",
  description: "Search notes and playlists on hpcnotes.eu.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const initialQuery = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  return (
    <VStack gap={8}>
      <PageHeading
        title="Search"
        summary="Titles, summaries, tags, and bodies — plus playlists when the name matches."
        trail={[
          { href: "/", label: "notes" },
          { label: "search", current: true },
        ]}
      />
      <SearchNotes notes={getNotes()} initialQuery={initialQuery} />
    </VStack>
  );
}
