import type { Metadata } from "next";
import type { Note } from "@/content/types";
import { isIsoDate } from "@/lib/dates";
import { SITE_NAME } from "@/lib/site-url";

export function notePageMetadata(note: Note): Metadata {
  const description = note.summary.trim() || note.title;
  const canonical = `/notes/${note.slug}`;
  const published = isIsoDate(note.date)
    ? `${note.date}T00:00:00.000Z`
    : undefined;

  return {
    title: note.title,
    description,
    authors: [{ name: note.author || "hpcnotes" }],
    keywords: note.tags,
    category: note.tags[0],
    alternates: {
      canonical,
      types: {
        "text/markdown": `/notes/${note.slug}.md`,
      },
    },
    other: {
      citation_title: note.title,
      citation_author: note.author || "hpcnotes",
      citation_publication_date: note.date,
      citation_language: "en",
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: note.title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: published,
      authors: [note.author || "hpcnotes"],
      tags: note.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description,
    },
  };
}
