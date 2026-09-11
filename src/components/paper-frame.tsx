import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import { PaperMark } from "@/components/paper-mark";

export function PaperFrame({
  notes,
  children,
}: {
  notes: NoteIndex[];
  children: React.ReactNode;
}) {
  return (
    <Layout
      height="auto"
      contentWidth={640}
      padding={6}
      defaultHasDividers={false}
      content={
        <LayoutContent isScrollable={false}>
          <VStack gap={10} className="paper-sheet" paddingBlockEnd={10}>
            <PaperMark notes={notes}>{children}</PaperMark>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
