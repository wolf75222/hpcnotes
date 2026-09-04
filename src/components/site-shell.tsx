import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
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
          <VStack gap={10} paddingBlockStart={6} paddingBlockEnd={10}>
            <PaperMark notes={notes} />
            {children}
            <Link
              href="/about"
              color="secondary"
              type="supporting"
              display="block"
            >
              about
            </Link>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
