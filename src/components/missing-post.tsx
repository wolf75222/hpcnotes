import { EmptyNotes } from "@/components/empty-notes";

export function MissingPost() {
  return (
    <EmptyNotes
      title="That note is not here"
      description="The slug may have moved, or it never existed."
      headingLevel={1}
    />
  );
}
