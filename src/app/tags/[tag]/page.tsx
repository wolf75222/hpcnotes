import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { PageHeading } from "@/components/page-heading";
import { NoteList } from "@/components/note-list";
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
    title: decoded,
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
    <VStack gap={8}>
      <PageHeading title={decoded} summary={`Notes tagged ${decoded}.`} />
      {notes.length === 0 ? (
        <VStack gap={2}>
          <Text color="secondary">Nothing carries that tag yet.</Text>
          <Link href="/tags" hasUnderline>
            All tags
          </Link>
        </VStack>
      ) : (
        <NoteList notes={notes} grouped />
      )}
    </VStack>
  );
}
