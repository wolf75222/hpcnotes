import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
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
  if (!/^\d{4}$/.test(year)) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: year,
    description: `Notes from ${year}.`,
    alternates: { canonical: `/years/${year}` },
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) {
    notFound();
  }
  const notes = getNotesByYear(year);
  if (notes.length === 0) {
    notFound();
  }

  return (
    <VStack gap={6}>
      <Text type="supporting">{year}</Text>
      <NoteList notes={notes} showSummary />
    </VStack>
  );
}
