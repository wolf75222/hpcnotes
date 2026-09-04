import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { EmptyNotes } from "@/components/empty-notes";
import { LeaderRow } from "@/components/leader-row";
import { getTags } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse notes by tag.",
};

export default function ExplorePage() {
  const tags = [...getTags()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );

  if (tags.length === 0) {
    return (
      <EmptyNotes
        title="No tags yet"
        description="Tags live at the end of a note, as #labels."
      />
    );
  }

  return (
    <VStack gap={5}>
      {tags.map(({ tag, count }) => (
        <LeaderRow
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          label={`#${tag}`}
          meta={String(count)}
        />
      ))}
    </VStack>
  );
}
