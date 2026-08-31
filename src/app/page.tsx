import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { PageFrame } from "@/components/page-frame";
import { AdSlot } from "@/components/ad-slot";
import { getPosts } from "@/content/posts";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "HPC Wiki",
  description:
    "A small blog of site-independent notes on high-performance computing: Slurm, MPI, GPUs, and the habits that transfer between clusters.",
};

export default function HomePage() {
  const posts = getPosts();

  return (
    <PageFrame>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading level={1}>HPC Wiki</Heading>
          <Text color="secondary">
            Short notes on high-performance computing. Local docs still own
            hostnames. These posts own the habits that transfer.
          </Text>
        </VStack>
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="When a note ships, it will show up here."
            headingLevel={2}
          />
        ) : (
          <List header={<Heading level={2}>Posts</Heading>} hasDividers>
            {posts.map((post) => (
              <ListItem
                key={post.slug}
                label={post.title}
                description={
                  <Text color="secondary">{post.summary}</Text>
                }
                href={`/${post.slug}`}
                endContent={
                  <Text type="supporting">{formatDate(post.date)}</Text>
                }
              />
            ))}
          </List>
        )}
        <AdSlot placement="infeed" />
      </VStack>
    </PageFrame>
  );
}
