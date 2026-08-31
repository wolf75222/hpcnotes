"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@astryxdesign/core/AppShell";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { SideNav, SideNavItem, SideNavSection } from "@astryxdesign/core/SideNav";
import { NavIcon } from "@astryxdesign/core/NavIcon";
import { Icon } from "@astryxdesign/core/Icon";
import { Button } from "@astryxdesign/core/Button";
import { Kbd } from "@astryxdesign/core/Kbd";
import { useHotkeys } from "@astryxdesign/core/hooks";
import { VStack } from "@astryxdesign/core/Stack";
import {
  BookOpen,
  Code2,
  Cpu,
  GraduationCap,
  Newspaper,
  PenLine,
  Search,
  Server,
  Users,
} from "lucide-react";
import { AUDIENCES } from "@/content/audiences";
import { WIKI_PAGES } from "@/content/wiki";
import { SearchPalette } from "@/components/search-palette";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";

const AUDIENCE_ICONS = {
  basics: GraduationCap,
  user: Users,
  developer: Code2,
  admin: Server,
} as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useHotkeys([
    {
      keys: "mod+k",
      onPress: () => setIsPaletteOpen(true),
      allowInInputs: true,
    },
  ]);

  const wikiByAudience = useMemo(() => {
    return AUDIENCES.map((audience) => ({
      audience,
      pages: WIKI_PAGES.filter((page) => page.audience === audience.id),
    }));
  }, []);

  return (
    <>
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
            startContent={
              <>
                <TopNavItem
                  label="Wiki"
                  href="/wiki"
                  isSelected={pathname === "/wiki" || pathname.startsWith("/wiki/")}
                />
                <TopNavItem
                  label="Blog"
                  href="/blog"
                  isSelected={pathname === "/blog" || pathname.startsWith("/blog/")}
                />
                <TopNavItem
                  label="Contribute"
                  href="/contribute"
                  isSelected={pathname === "/contribute"}
                />
              </>
            }
            endContent={
              <>
                <Button
                  label="Search"
                  variant="ghost"
                  size="sm"
                  icon={<Icon icon={Search} />}
                  tooltip="Search wiki and blog"
                  onClick={() => setIsPaletteOpen(true)}
                />
                <Kbd keys="mod+k" />
                <ThemeToggle />
              </>
            }
          />
        }
        sideNav={
          <SideNav
            collapsible
            resizable={{ defaultWidth: 260, minWidth: 200, maxWidth: 360 }}
          >
            <SideNavSection title="Start">
              <SideNavItem
                label="Home"
                href="/"
                icon={BookOpen}
                isSelected={pathname === "/"}
              />
              <SideNavItem
                label="Wiki index"
                href="/wiki"
                icon={BookOpen}
                isSelected={pathname === "/wiki"}
              />
              <SideNavItem
                label="Blog"
                href="/blog"
                icon={Newspaper}
                isSelected={pathname === "/blog" || pathname.startsWith("/blog/")}
              />
              <SideNavItem
                label="Search"
                href="/search"
                icon={Search}
                isSelected={pathname === "/search"}
              />
            </SideNavSection>
            {wikiByAudience.map(({ audience, pages }) => (
              <SideNavSection key={audience.id} title={audience.shortTitle}>
                <SideNavItem
                  label={audience.title}
                  href={audience.href}
                  icon={AUDIENCE_ICONS[audience.id]}
                  isSelected={pathname === audience.href}
                  collapsible
                >
                  {pages.map((page) => (
                    <SideNavItem
                      key={page.slug}
                      label={page.title}
                      href={`/wiki/${page.slug}`}
                      isSelected={pathname === `/wiki/${page.slug}`}
                    />
                  ))}
                </SideNavItem>
              </SideNavSection>
            ))}
            <SideNavSection title="Community">
              <SideNavItem
                label="Contribute"
                href="/contribute"
                icon={PenLine}
                isSelected={pathname === "/contribute"}
              />
            </SideNavSection>
          </SideNav>
        }
      >
        <VStack gap={0}>
          {children}
          <SiteFooter />
        </VStack>
      </AppShell>
      <SearchPalette isOpen={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
    </>
  );
}
