import type { MetadataRoute } from "next";
import { getTags, getYears } from "@/content/catalog";
import { getPublishedNotes } from "@/content/load-notes";
import { isIsoDate } from "@/lib/dates";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

function lastModified(iso: string | undefined) {
  return iso != null && isIsoDate(iso) ? iso : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const notes = getPublishedNotes();
  const newest = notes.reduce((latest, note) => {
    if (!isIsoDate(note.date)) {
      return latest;
    }
    return latest == null || note.date > latest ? note.date : latest;
  }, undefined as string | undefined);

  return [
    {
      url: site,
      lastModified: lastModified(newest),
      changeFrequency: "weekly",
    },
    {
      url: `${site}/explore`,
      lastModified: lastModified(newest),
      changeFrequency: "weekly",
    },
    ...notes.map((note) => ({
      url: `${site}/notes/${note.slug}`,
      lastModified: lastModified(note.date),
    })),
    ...getTags().map(({ tag }) => ({
      url: `${site}/tags/${encodeURIComponent(tag)}`,
    })),
    ...getYears().map(({ year }) => ({
      url: `${site}/years/${year}`,
    })),
  ];
}
