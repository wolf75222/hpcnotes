import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
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
    <VStack gap={8}>
      <PageHeading
        title={year}
        summary={`Notes dated ${year}.`}
        trail={[
          { href: "/", label: "notes" },
          { href: "/years", label: "years" },
          { label: year, current: true },
        ]}
      />
      {notes.length === 0 ? (
        <EmptyNotes
          title="No notes in that year"
          description="The archive only lists years that already have a note."
          actionHref="/years"
          actionLabel="All years"
        />
      ) : (
        <NoteList notes={notes} />
      )}
    </VStack>
  );
}
