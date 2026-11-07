import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import type { NoteIndex } from "@/content/types";
import { PaperMark } from "@/components/paper-mark";
import type { SiteNavData } from "@/components/site-nav";

export function PaperFrame({
  notes,
  nav,
  children,
}: {
  notes: NoteIndex[];
  nav: SiteNavData;
  children: React.ReactNode;
}) {
  return (
    <Layout
      height="auto"
      contentWidth={1240}
      padding={6}
      defaultHasDividers={false}
      content={
        <LayoutContent isScrollable={false}>
          <Link href="#content" className="skip-link" type="supporting">
            Skip to content
          </Link>
          <VStack gap={10} className="paper-sheet" paddingBlockEnd={10}>
            <PaperMark notes={notes} nav={nav}>{children}</PaperMark>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
