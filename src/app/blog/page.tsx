import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { Token } from "@astryxdesign/core/Token";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { PageFrame } from "@/components/page-frame";
import { AdSlot } from "@/components/ad-slot";
import { BLOG_POSTS } from "@/content/blog";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dated notes from HPC Wiki: documentation practice, Slurm, performance engineering, and first GPU jobs.",
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageFrame>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading level={1}>Blog</Heading>
          <Text color="secondary">
            Dated, opinionated, and allowed to age. The wiki is the map; these
            posts are the war stories that made the map worth writing.
          </Text>
        </VStack>
        <List header={<Heading level={2}>All posts</Heading>} hasDividers>
          {posts.map((post) => (
            <ListItem
              key={post.slug}
              label={post.title}
              description={`${formatDate(post.date)} · ${post.summary}`}
              href={`/blog/${post.slug}`}
              endContent={
                <HStack gap={1}>
                  {post.tags.slice(0, 2).map((tag) => (
                    <Token key={tag} label={tag} size="sm" />
                  ))}
                </HStack>
              }
            />
          ))}
        </List>
        <AdSlot placement="infeed" />
      </VStack>
    </PageFrame>
  );
}
