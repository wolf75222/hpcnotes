import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Button } from "@astryxdesign/core/Button";

export function EmptyNotes({
  title,
  description,
  actionHref = "/",
  actionLabel = "All notes",
  headingLevel = 2,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      headingLevel={headingLevel}
      isCompact
      actions={
        <Button variant="ghost" href={actionHref} label={actionLabel} />
      }
    />
  );
}
