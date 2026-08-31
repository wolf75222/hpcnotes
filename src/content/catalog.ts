import { AUDIENCES } from "./audiences";
import { BLOG_POSTS } from "./blog";
import type { SearchHit, WikiAudience } from "./types";
import { WIKI_PAGES } from "./wiki";

const STATIC_PAGES: SearchHit[] = [
  {
    kind: "page",
    id: "home",
    title: "HPC Wiki home",
    href: "/",
    group: "Pages",
    description: "Target groups, featured wiki pages, and the latest blog posts.",
  },
  {
    kind: "page",
    id: "wiki-index",
    title: "Wiki index",
    href: "/wiki",
    group: "Pages",
    description: "All site-independent HPC articles by audience.",
  },
  {
    kind: "page",
    id: "blog-index",
    title: "Blog",
    href: "/blog",
    group: "Pages",
    description: "Notes, war stories, and dated commentary alongside the wiki.",
  },
  {
    kind: "page",
    id: "contribute",
    title: "Contribute",
    href: "/contribute",
    group: "Pages",
    description: "How to add wiki pages, blog posts, and Google AdSense.",
  },
  ...AUDIENCES.map((audience) => ({
    kind: "page" as const,
    id: `category-${audience.id}`,
    title: audience.title,
    href: audience.href,
    group: "Audiences",
    description: audience.summary,
  })),
];

export function getWikiPages(audience?: WikiAudience) {
  const pages = audience
    ? WIKI_PAGES.filter((page) => page.audience === audience)
    : WIKI_PAGES;
  return pages;
}

export function getLatestBlogPosts(limit = 4) {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function getRelatedWiki(slugs: string[]) {
  return slugs
    .map((slug) => WIKI_PAGES.find((page) => page.slug === slug))
    .filter((page): page is (typeof WIKI_PAGES)[number] => page != null);
}

export function getAllSearchHits(): SearchHit[] {
  const wikiHits: SearchHit[] = WIKI_PAGES.map((page) => ({
    kind: "wiki",
    id: page.slug,
    title: page.title,
    href: `/wiki/${page.slug}`,
    group: "Wiki",
    description: page.summary,
  }));

  const blogHits: SearchHit[] = BLOG_POSTS.map((post) => ({
    kind: "blog",
    id: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    group: "Blog",
    description: post.summary,
  }));

  return [...STATIC_PAGES, ...wikiHits, ...blogHits];
}

function haystackFor(hit: SearchHit): string {
  if (hit.kind === "wiki") {
    const page = WIKI_PAGES.find((item) => item.slug === hit.id);
    return [hit.title, hit.description, page?.body ?? ""].join(" ").toLowerCase();
  }
  if (hit.kind === "blog") {
    const post = BLOG_POSTS.find((item) => item.slug === hit.id);
    return [hit.title, hit.description, post?.body ?? "", post?.tags.join(" ") ?? ""].join(" ").toLowerCase();
  }
  return [hit.title, hit.description].join(" ").toLowerCase();
}

export function searchContent(query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return [];
  }
  return getAllSearchHits().filter((hit) => haystackFor(hit).includes(needle));
}
