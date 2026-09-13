import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { JsonLd } from "@/components/json-ld";
import { NoteList } from "@/components/note-list";
import { getNotesByYear, getYears } from "@/content/catalog";
import { collectionJsonLd } from "@/lib/json-ld";
import { notFoundMetadata, pageMetadata } from "@/lib/page-metadata";

export const dynamicParams = false;

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
    return notFoundMetadata();
  }
  const description = `HPC notes from ${year}.`;
  return pageMetadata({
    title: `Notes from ${year}`,
    description,
    path: `/years/${year}`,
  });
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
  const description = `HPC notes from ${year}.`;

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: `Notes from ${year}`,
          description,
          path: `/years/${year}`,
        })}
      />
      <VStack gap={6}>
        <Heading level={1} color="primary">
          {year}
        </Heading>
        <NoteList notes={notes} showSummary />
      </VStack>
    </>
  );
}
