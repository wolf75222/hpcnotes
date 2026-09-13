import type { Metadata } from "next";
import { MissingPost } from "@/components/missing-post";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NoteNotFound() {
  return <MissingPost />;
}
