import { paperOgImage, ogContentType, ogSize } from "@/lib/paper-og";

export const alt = "Terms and conditions · hpcnotes.eu";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return paperOgImage({
    kicker: "hpcnotes.eu",
    title: "Terms and conditions",
    meta: "hpcnotes.eu",
  });
}
