import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      height="auto"
      contentWidth={640}
      padding={8}
      content={
        <LayoutContent>
          <VStack gap={10} paddingBlockStart={4} paddingBlockEnd={8}>
            {children}
            <SiteFooter />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
