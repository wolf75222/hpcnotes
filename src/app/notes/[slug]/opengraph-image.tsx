import { getNoteBySlug, getNotes } from "@/content/load-notes";
import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";
import { formatDotDate, isIsoDate } from "@/lib/dates";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";

export const alt = "hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = safeDecodeParam((await params).slug);
  const note = isNoteSlug(slug) ? getNoteBySlug(slug) : undefined;
  const title = note?.title ?? "Not here";
  const meta =
    note != null && isIsoDate(note.date)
      ? `${formatDotDate(note.date)} · hpcnotes.eu`
      : "hpcnotes.eu";

  return paperOgImage({ title, meta });
}
