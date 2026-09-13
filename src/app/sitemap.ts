import type { MetadataRoute } from "next";
import { getNotesByTag, getNotesByYear, getTags, getYears } from "@/content/catalog";
import { getPublishedNotes } from "@/content/load-notes";
import { isIsoDate } from "@/lib/dates";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

function lastModified(iso: string | undefined) {
  return iso != null && isIsoDate(iso) ? iso : undefined;
}

function newestDate(dates: string[]) {
  return dates.reduce((latest, date) => {
    if (!isIsoDate(date)) {
      return latest;
    }
    return latest == null || date > latest ? date : latest;
  }, undefined as string | undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const notes = getPublishedNotes();
  const newest = newestDate(notes.map((note) => note.date));

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
    {
      url: `${site}/llms.txt`,
      lastModified: lastModified(newest),
    },
    {
      url: `${site}/llms-full.txt`,
      lastModified: lastModified(newest),
    },
    ...notes.map((note) => ({
      url: `${site}/notes/${note.slug}`,
      lastModified: lastModified(note.date),
    })),
    ...getTags().map(({ tag }) => ({
      url: `${site}/tags/${encodeURIComponent(tag)}`,
      lastModified: lastModified(
        newestDate(getNotesByTag(tag).map((note) => note.date)),
      ),
    })),
    ...getYears().map(({ year }) => ({
      url: `${site}/years/${year}`,
      lastModified: lastModified(
        newestDate(getNotesByYear(year).map((note) => note.date)),
      ),
    })),
  ];
}
