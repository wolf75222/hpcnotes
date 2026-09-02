import type { Metadata } from "next";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";
import { LeaderRow } from "@/components/leader-row";
import { getTags } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse hpcnotes.eu by tag.",
};

export default function TagsPage() {
  const tags = getTags();

  return (
    <VStack gap={8}>
      <PageHeading
        title="Tags"
        summary="Every note carries a few short tags. Open one to see only that slice."
        trail={[
          { href: "/", label: "notes" },
          { label: "tags", current: true },
        ]}
      />
      <VStack gap={4}>
        {tags.map(({ tag, count }) => (
          <LeaderRow
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            label={tag}
            meta={count === 1 ? "1 note" : `${count} notes`}
          />
        ))}
      </VStack>
    </VStack>
  );
}
