import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { getNotesByTag, getTags } from "@/content/catalog";
import { isSafeTag, normalizeTag, safeDecodeParam } from "@/lib/slugs";

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
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `#${decoded}`,
    description: `Notes tagged ${decoded}.`,
    alternates: { canonical: `/tags/${encodeURIComponent(decoded)}` },
  };
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

  return (
    <VStack gap={6}>
      <Heading level={1} color="primary">
        #{decoded}
      </Heading>
      <NoteList notes={notes} grouped showSummary />
    </VStack>
  );
}
