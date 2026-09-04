import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { PaperMark } from "@/components/paper-mark";
import { getNotes } from "@/content/load-notes";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const notes = getNotes();

  return (
    <Layout
      height="auto"
      contentWidth={640}
      padding={6}
      defaultHasDividers={false}
      content={
        <LayoutContent>
          <VStack gap={10} paddingBlockStart={8} paddingBlockEnd={10}>
            <PaperMark notes={notes}>{children}</PaperMark>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
