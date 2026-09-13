import { EmptyNotes } from "@/components/empty-notes";
import { notFoundMetadata } from "@/lib/page-metadata";

export const metadata = notFoundMetadata();

export default function NotFound() {
  return (
    <EmptyNotes
      title="Not here"
      description="The address may have moved, or it never existed."
      headingLevel={1}
    />
  );
}
