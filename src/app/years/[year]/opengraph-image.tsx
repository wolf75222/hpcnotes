import { getYears } from "@/content/catalog";
import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";

export const alt = "hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return getYears().map(({ year }) => ({ year }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return paperOgImage({
    kicker: "hpcnotes.eu",
    title: year,
    meta: "Notes",
  });
}
