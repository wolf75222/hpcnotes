import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Button } from "@astryxdesign/core/Button";
import { PageFrame } from "@/components/page-frame";

export function MissingPost() {
  return (
    <PageFrame>
      <EmptyState
        title="That post is not here"
        description="The slug may have moved, or it never existed. The index lists every post."
        headingLevel={1}
        actions={<Button label="All posts" variant="primary" href="/" />}
      />
    </PageFrame>
  );
}
