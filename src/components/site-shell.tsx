import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      height="auto"
      contentWidth={720}
      padding={8}
      content={
        <LayoutContent>
          <VStack gap={8} paddingBlockStart={4} paddingBlockEnd={8}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
