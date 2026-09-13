import { getPublishedNotes } from "@/content/load-notes";
import { isIsoDate } from "@/lib/dates";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site-url";

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
  const newest = notes[0]?.date;
  const items = notes
    .map((note) => {
      const url = `${site}/notes/${note.slug}`;
      const description = note.summary === "" ? note.title : note.summary;
      const categories = note.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(note.date)}</pubDate>
      <description>${escapeXml(description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(site)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${site}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${newest != null ? `    <lastBuildDate>${rfc822(newest)}</lastBuildDate>\n` : ""}${items}
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
