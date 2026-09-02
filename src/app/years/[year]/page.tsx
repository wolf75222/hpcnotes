import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { EmptyNotes } from "@/components/empty-notes";
import { getNotesByYear, getYears } from "@/content/catalog";

export function generateStaticParams() {
  return getYears().map(({ year }) => ({ year }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: year,
    description: `Notes from ${year}.`,
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const notes = /^\d{4}$/.test(year) ? getNotesByYear(year) : [];

  return (
    <VStack gap={6}>
      <Text type="supporting" color="secondary">
        {year}
      </Text>
      {notes.length === 0 ? (
        <EmptyNotes
          title="No notes in that year"
          description="The list only shows years that already have a note."
        />
      ) : (
        <NoteList notes={notes} />
      )}
    </VStack>
  );
}
