import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { MarkdownDoc } from "@/components/markdown-doc";
import { AdSlot } from "@/components/ad-slot";
import { SiteBrand } from "@/components/site-brand";
import { WritingList } from "@/components/writing-list";
import { getOtherPosts, getPosts, POSTS_BY_SLUG } from "@/content/posts";
import { formatDate } from "@/lib/dates";
import { MissingPost } from "@/components/missing-post";

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
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
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
    return <MissingPost />;
  }

  const others = getOtherPosts(post.slug);

  return (
    <VStack gap={8}>
      <SiteBrand />
      <VStack gap={3}>
        <Text type="supporting">{formatDate(post.date)}</Text>
        <Heading level={1}>{post.title}</Heading>
      </VStack>
      <MarkdownDoc>{post.body}</MarkdownDoc>
      <WritingList posts={others} heading="More writing" />
      <AdSlot placement="article" />
    </VStack>
  );
}
