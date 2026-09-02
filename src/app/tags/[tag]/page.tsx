import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
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
      <PageHeading
        title={decoded}
        summary={`Notes tagged ${decoded}.`}
        trail={[
          { href: "/", label: "notes" },
          { href: "/tags", label: "tags" },
          { label: decoded, current: true },
        ]}
      />
      {notes.length === 0 ? (
        <EmptyNotes
          title="Nothing carries that tag yet"
          description="Tags are short labels on notes. Pick another from the index."
          actionHref="/tags"
          actionLabel="All tags"
        />
      ) : (
        <NoteList notes={notes} grouped />
      )}
    </VStack>
  );
}
