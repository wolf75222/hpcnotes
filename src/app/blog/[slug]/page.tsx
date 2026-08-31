import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleScreen } from "@/components/article-screen";
import { BLOG_BY_SLUG, BLOG_POSTS } from "@/content/blog";
import { formatDate } from "@/lib/dates";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_BY_SLUG[slug];
  if (post == null) {
    return { title: "Not found" };
  }
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_BY_SLUG[slug];
  if (post == null) {
    notFound();
  }

  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug)
    .slice(0, 3)
    .map((item) => ({
      href: `/blog/${item.slug}`,
      title: item.title,
      description: item.summary,
    }));

  return (
    <ArticleScreen
      crumbs={[
        { href: "/", label: "HPC Wiki" },
        { href: "/blog", label: "Blog" },
        { label: post.title, isCurrent: true },
      ]}
      kicker="Blog"
      kickerHref="/blog"
      kickerColor="cyan"
      title={post.title}
      description={post.summary}
      meta={`${formatDate(post.date)} · ${post.author}`}
      body={post.body}
      related={related}
    />
  );
}
