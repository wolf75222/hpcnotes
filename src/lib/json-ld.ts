import type { Note, NoteIndex } from "@/content/types";
import { isIsoDate } from "@/lib/dates";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, getSiteUrl, noteMarkdownUrl, noteUrl } from "@/lib/site-url";

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function websiteNode() {
  const site = getSiteUrl();
  return {
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: SITE_NAME,
    url: site,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: "hpcnotes",
      url: site,
    },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    ...websiteNode(),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(),
      {
        "@type": "WebPage",
        name,
        description,
        url: absoluteUrl(path),
        inLanguage: "en",
        dateModified:
          dateModified != null && isIsoDate(dateModified)
            ? `${dateModified}T00:00:00.000Z`
            : undefined,
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
      },
    ],
  };
}

export function collectionJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(),
      {
        "@type": "CollectionPage",
        name,
        description,
        url: absoluteUrl(path),
        inLanguage: "en",
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
      },
    ],
  };
}

function publishedAt(iso: string) {
  return isIsoDate(iso) ? `${iso}T00:00:00.000Z` : undefined;
}

function wordCount(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean);
  return words.length > 0 ? words.length : undefined;
}

export function noteJsonLd(note: Note, ancestors: NoteIndex[]) {
  const url = noteUrl(note.slug);
  const site = getSiteUrl();
  const date = publishedAt(note.date);
  const crumbs = [
    { name: SITE_NAME, path: "/" },
    ...ancestors.map((item) => ({
      name: item.title,
      path: `/notes/${item.slug}`,
    })),
    { name: note.title, path: `/notes/${note.slug}` },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(),
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: note.title,
        name: note.title,
        description: note.summary.trim() || note.title,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        datePublished: date,
        author: {
          "@type": "Person",
          name: note.author || "hpcnotes",
          url: site,
        },
        publisher: {
          "@type": "Person",
          name: "hpcnotes",
          url: site,
        },
        keywords: note.tags,
        wordCount: wordCount(note.body),
        isPartOf: { "@id": `${site}/#website` },
        associatedMedia: {
          "@type": "MediaObject",
          contentUrl: noteMarkdownUrl(note.slug),
          encodingFormat: "text/markdown",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      },
    ],
  };
}
