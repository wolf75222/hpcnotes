import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import { SearchPalette } from "@/components/search-palette";
import { getNotes } from "@/content/load-notes";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const notes = getNotes();

  return (
    <>
      <Layout
        height="auto"
        contentWidth={640}
        padding={6}
        defaultHasDividers={false}
        content={
          <LayoutContent>
            <VStack gap={8} paddingBlockStart={4} paddingBlockEnd={8}>
              <Link
                href="/"
                color="secondary"
                type="supporting"
                isStandalone
              >
                hpcnotes
              </Link>
              {children}
              <Link
                href="/about"
                color="secondary"
                type="supporting"
                isStandalone
              >
                about
              </Link>
            </VStack>
          </LayoutContent>
        }
      />
      <SearchPalette notes={notes} />
    </>
  );
}
