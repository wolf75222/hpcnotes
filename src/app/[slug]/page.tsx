import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs";
import { PageFrame } from "@/components/page-frame";
import { MarkdownDoc } from "@/components/markdown-doc";
import { AdSlot } from "@/components/ad-slot";
import { getOtherPosts, getPosts, POSTS_BY_SLUG } from "@/content/posts";
import { formatDate } from "@/lib/dates";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_BY_SLUG[slug];
  if (post == null) {
    return { title: "Not found" };
  }
  return { title: post.title, description: post.summary };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS_BY_SLUG[slug];
  if (post == null) {
    notFound();
  }

  const others = getOtherPosts(post.slug);

  return (
    <PageFrame>
      <VStack gap={6}>
        <Breadcrumbs label="Location" variant="supporting">
          <BreadcrumbItem href="/">Posts</BreadcrumbItem>
          <BreadcrumbItem isCurrent>{post.title}</BreadcrumbItem>
        </Breadcrumbs>
        <VStack gap={2}>
          <Text type="supporting">
            {formatDate(post.date)} · {post.author}
          </Text>
          <Heading level={1}>{post.title}</Heading>
          <Text color="secondary">{post.summary}</Text>
        </VStack>
        <MarkdownDoc>{post.body}</MarkdownDoc>
        {others.length > 0 ? (
          <List header={<Heading level={2}>More posts</Heading>} hasDividers>
            {others.map((item) => (
              <ListItem
                key={item.slug}
                label={item.title}
                description={<Text color="secondary">{item.summary}</Text>}
                href={`/${item.slug}`}
              />
            ))}
          </List>
        ) : null}
        <AdSlot placement="article" />
      </VStack>
    </PageFrame>
  );
}
