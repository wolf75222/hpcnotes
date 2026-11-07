"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { PaperChrome } from "@/components/paper-chrome";
import { PaperToTop } from "@/components/paper-to-top";
import type { NoteIndex } from "@/content/types";
import { SiteNav, type SiteNavData } from "@/components/site-nav";

export function PaperMark({
  notes,
  nav,
  children,
}: {
  notes: NoteIndex[];
  nav: SiteNavData;
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const savedScroll = useRef<number | null>(null);
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  const onSearchOpenChange = useCallback((open: boolean) => {
    setSearchOpen((wasOpen) => {
      if (open && !wasOpen) {
        // Remember the reading position; the panel replaces the page.
        savedScroll.current = window.scrollY;
        window.scrollTo({ top: 0 });
      }
      return open;
    });
    if (!open) {
      const restore = savedScroll.current;
      savedScroll.current = null;
      window.requestAnimationFrame(() => {
        searchButtonRef.current?.focus({ preventScroll: true });
        if (restore != null) {
          window.scrollTo({ top: restore });
        }
      });
    }
  }, []);

  // Back/forward while the panel is open: show the page that was navigated to.
  useEffect(() => {
    if (lastPath.current === pathname) {
      return;
    }
    lastPath.current = pathname;
    savedScroll.current = null;
    setSearchOpen(false);
  }, [pathname]);

  return (
    <VStack gap={0}>
      <PaperChrome
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchButtonRef={searchButtonRef}
      />
      <HStack gap={0} align="start" className="paper-body">
        <SiteNav data={nav} />
        <VStack gap={0} className="paper-below-mark" as="main" id="content" tabIndex={-1}>
          <SearchPalette
            notes={notes}
            open={searchOpen}
            onOpenChange={onSearchOpenChange}
          >
            {children}
          </SearchPalette>
        </VStack>
      </HStack>
      <PaperToTop hidden={searchOpen} />
    </VStack>
  );
}
