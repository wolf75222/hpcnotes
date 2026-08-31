"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@astryxdesign/core/AppShell";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { NavIcon } from "@astryxdesign/core/NavIcon";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Stack";
import { Cpu } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      height="auto"
      contentPadding={0}
      variant="section"
      mobileNav={{ breakpoint: "md" }}
      topNav={
        <TopNav
          label="HPC Wiki"
          heading={
            <TopNavHeading
              heading="HPC Wiki"
              headingHref="/"
              logo={
                <NavIcon icon={<Icon icon={Cpu} color="inherit" size="sm" />} />
              }
            />
          }
        >
          <TopNavItem label="Posts" href="/" isSelected={pathname === "/"} />
        </TopNav>
      }
    >
      <VStack gap={0}>
        {children}
        <SiteFooter />
      </VStack>
    </AppShell>
  );
}
