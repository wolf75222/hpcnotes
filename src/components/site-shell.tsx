import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Section } from "@astryxdesign/core/Section";
import { VStack } from "@astryxdesign/core/Stack";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      height="auto"
      padding={5}
      content={
        <LayoutContent>
          <Section variant="section" padding={8} minHeight="80dvh">
            <VStack gap={8} minHeight="80dvh" justify="between">
              <VStack gap={8}>
                <SiteHeader />
                <VStack gap={8} maxWidth={720}>
                  {children}
                </VStack>
              </VStack>
              <SiteFooter />
            </VStack>
          </Section>
        </LayoutContent>
      }
    />
  );
}
