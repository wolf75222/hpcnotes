import { Heading } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { EmptyNotes } from "@/components/empty-notes";
import { JsonLd } from "@/components/json-ld";
import { LeaderRow } from "@/components/leader-row";
import { getTags } from "@/content/catalog";
import { collectionJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";

const description = "Browse published HPC notes by tag.";

export const metadata = pageMetadata({
  title: "Explore",
  description,
  path: "/explore",
});

export default function ExplorePage() {
  const tags = [...getTags()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );

  if (tags.length === 0) {
    return (
      <EmptyNotes
        title="No tags yet"
        description="Tags live at the end of a note, as #labels."
        headingLevel={1}
      />
    );
  }

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: "Explore",
          description,
          path: "/explore",
        })}
      />
      <VStack gap={8}>
      <Heading level={1} color="primary">
        Explore
      </Heading>
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
    </VStack>
    </>
  );
}
