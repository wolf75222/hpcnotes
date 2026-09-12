import { getPublishedNotes } from "@/content/load-notes";
import { isIsoDate } from "@/lib/dates";
import { getSiteUrl } from "@/lib/site-url";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rfc822(isoDate: string) {
  return new Date(`${isoDate}T00:00:00.000Z`).toUTCString();
}

export const dynamic = "force-static";

export function GET() {
  const site = getSiteUrl();
  const notes = getPublishedNotes().filter(
    (note) => isIsoDate(note.date) && note.parent == null,
  );
  const items = notes
    .map((note) => {
      const url = `${site}/notes/${note.slug}`;
      const description = note.summary === "" ? note.title : note.summary;
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${rfc822(note.date)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>hpcnotes.eu</title>
    <link>${escapeXml(site)}</link>
    <description>Short notes on high-performance computing, and personal thoughts around HPC.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  });
}
