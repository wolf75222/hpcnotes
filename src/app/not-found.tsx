import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Button } from "@astryxdesign/core/Button";
import { PageFrame } from "@/components/page-frame";
import { AppIcon } from "@/components/app-icon";

export default function NotFound() {
  return (
    <PageFrame>
      <EmptyState
        title="That page is not in the wiki"
        description="The slug may have moved, or it never existed. Search the catalogue or start from the wiki index."
        icon={<AppIcon name="search" />}
        headingLevel={1}
        actions={
          <>
            <Button label="Search" variant="primary" href="/search" />
            <Button label="Wiki index" variant="secondary" href="/wiki" />
          </>
        }
      />
    </PageFrame>
  );
}
