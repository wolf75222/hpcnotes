import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { EmptyNotes } from "@/components/empty-notes";
import { getNotesByTag, getTags } from "@/content/catalog";

export function generateStaticParams() {
  return getTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Notes tagged ${decoded}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const notes = getNotesByTag(decoded);

  return (
    <VStack gap={6}>
      <Text type="supporting">#{decoded}</Text>
      {notes.length === 0 ? (
        <EmptyNotes
          title="Nothing carries that tag yet"
          description="Tags live at the end of a note, as #labels."
        />
      ) : (
        <NoteList notes={notes} grouped showSummary />
      )}
    </VStack>
  );
}
