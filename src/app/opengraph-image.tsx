import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";

export const alt = "hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return paperOgImage({
    kicker: "hpcnotes.eu",
    title: "hpcnotes",
    meta: "Notes on HPC",
  });
}
