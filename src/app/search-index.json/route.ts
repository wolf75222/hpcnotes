import { getNotes } from "@/content/load-notes";
import { markdownPlainText } from "@/lib/markdown-text";

export const dynamic = "force-static";

/** Body text for the search palette, fetched once on first open. */
export function GET() {
  const index: Record<string, string> = {};
  for (const note of getNotes()) {
    index[note.slug] = markdownPlainText(note.body);
  }
  return Response.json(index, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate",
      "X-Robots-Tag": "noindex",
    },
  });
}
