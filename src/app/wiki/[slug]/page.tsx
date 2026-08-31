import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleScreen } from "@/components/article-screen";
import { AUDIENCE_BY_ID, audienceColor } from "@/content/audiences";
import { WIKI_BY_SLUG, WIKI_PAGES } from "@/content/wiki";
import { getRelatedWiki } from "@/content/catalog";
import { formatDate } from "@/lib/dates";

export function generateStaticParams() {
  return WIKI_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = WIKI_BY_SLUG[slug];
  if (page == null) {
    return { title: "Not found" };
  }
  return { title: page.title, description: page.summary };
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = WIKI_BY_SLUG[slug];
  if (page == null) {
    notFound();
  }
  const audience = AUDIENCE_BY_ID[page.audience];
  const related = getRelatedWiki(page.related).map((item) => ({
    href: `/wiki/${item.slug}`,
    title: item.title,
    description: item.summary,
  }));

  return (
    <ArticleScreen
      crumbs={[
        { href: "/", label: "HPC Wiki" },
        { href: "/wiki", label: "Wiki" },
        { href: audience.href, label: audience.shortTitle },
        { label: page.title, isCurrent: true },
      ]}
      kicker={audience.title}
      kickerHref={audience.href}
      kickerColor={audienceColor(page.audience)}
      title={page.title}
      description={page.summary}
      meta={`Updated ${formatDate(page.updated)}`}
      body={page.body}
      related={related}
    />
  );
}
