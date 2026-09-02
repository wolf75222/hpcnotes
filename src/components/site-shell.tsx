"use client";

import { Layout, LayoutContent, LayoutPanel } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/Stack";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 48rem)", false);

  return (
    <Layout
      height="auto"
      contentWidth={isMobile ? 640 : 960}
      padding={isMobile ? 4 : 8}
      start={
        isMobile ? undefined : (
          <LayoutPanel width={140} hasDivider padding={0} label="Site">
            <SiteNav />
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent>
          <VStack gap={8} paddingBlockStart={4} paddingBlockEnd={10}>
            {isMobile ? <SiteNav orientation="horizontal" /> : null}
            {children}
            <SiteFooter />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
