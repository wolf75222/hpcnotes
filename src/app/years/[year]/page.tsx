import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { NoteList } from "@/components/note-list";
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
    <VStack gap={8}>
      <PageHeading title={year} summary={`Notes dated ${year}.`} />
      {notes.length === 0 ? (
        <VStack gap={2}>
          <Text color="secondary">No notes in that year.</Text>
          <Link href="/years" hasUnderline>
            All years
          </Link>
        </VStack>
      ) : (
        <NoteList notes={notes} />
      )}
    </VStack>
  );
}
