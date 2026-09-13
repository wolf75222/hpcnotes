import { getNoteSource, getNotes } from "@/content/load-notes";
import { markdownResponse } from "@/lib/markdown-response";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = safeDecodeParam((await params).slug);
  if (!isNoteSlug(slug)) {
    return new Response("Not found\n", { status: 404 });
  }
  const source = getNoteSource(slug);
  if (source == null) {
    return new Response("Not found\n", { status: 404 });
  }
  return markdownResponse(source, slug);
}
