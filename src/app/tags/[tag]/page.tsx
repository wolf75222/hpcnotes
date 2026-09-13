import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { JsonLd } from "@/components/json-ld";
import { NoteList } from "@/components/note-list";
import { getNotesByTag, getTags } from "@/content/catalog";
import { collectionJsonLd } from "@/lib/json-ld";
import { notFoundMetadata, pageMetadata } from "@/lib/page-metadata";
import { isSafeTag, normalizeTag, safeDecodeParam } from "@/lib/slugs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = normalizeTag(safeDecodeParam(tag));
  if (!isSafeTag(decoded)) {
    return notFoundMetadata();
  }
  const description = `HPC notes tagged ${decoded}.`;
  return pageMetadata({
    title: `Notes tagged ${decoded}`,
    description,
    path: `/tags/${encodeURIComponent(decoded)}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = normalizeTag(safeDecodeParam(tag));
  if (!isSafeTag(decoded)) {
    notFound();
  }
  const notes = getNotesByTag(decoded);
  if (notes.length === 0) {
    notFound();
  }
  const description = `HPC notes tagged ${decoded}.`;

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: `#${decoded}`,
          description,
          path: `/tags/${encodeURIComponent(decoded)}`,
        })}
      />
      <VStack gap={6}>
      <Heading level={1} color="primary">
        #{decoded}
      </Heading>
      <NoteList notes={notes} grouped showSummary />
    </VStack>
    </>
  );
}
