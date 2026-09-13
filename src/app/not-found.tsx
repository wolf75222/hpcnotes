import type { Metadata } from "next";
import { EmptyNotes } from "@/components/empty-notes";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <EmptyNotes
      title="Not here"
      description="The address may have moved, or it never existed."
      headingLevel={1}
    />
  );
}
