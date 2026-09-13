import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";
import { SITE_DESCRIPTION } from "@/lib/site-url";

export const alt = "hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return paperOgImage({
    title: "hpcnotes",
    meta: SITE_DESCRIPTION,
  });
}
