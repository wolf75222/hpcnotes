import { getTags } from "@/content/catalog";
import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";
import { normalizeTag, safeDecodeParam } from "@/lib/slugs";

export const alt = "hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map(({ tag }) => ({ tag }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const tag = normalizeTag(safeDecodeParam((await params).tag));
  return paperOgImage({
    kicker: "hpcnotes.eu",
    title: `#${tag}`,
    meta: "Explore",
  });
}
