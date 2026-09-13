import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";

export const alt = "Privacy policy · hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return paperOgImage({
    kicker: "hpcnotes.eu",
    title: "Privacy policy",
    meta: "Everything is public",
  });
}
