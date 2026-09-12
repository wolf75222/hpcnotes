"use client";

import { useCallback, useRef, useState } from "react";
import { VStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { PaperChrome } from "@/components/paper-chrome";
import { PaperToTop } from "@/components/paper-to-top";
import type { NoteIndex } from "@/content/types";

export function PaperMark({
  notes,
  children,
}: {
  notes: NoteIndex[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const onSearchOpenChange = useCallback((open: boolean) => {
    setSearchOpen(open);
    if (!open) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  }, []);

  return (
    <VStack gap={0}>
      <PaperChrome
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchButtonRef={searchButtonRef}
      />
      <VStack gap={0} className="paper-below-mark">
        <SearchPalette
          notes={notes}
          open={searchOpen}
          onOpenChange={onSearchOpenChange}
        >
          {children}
        </SearchPalette>
      </VStack>
      <PaperToTop hidden={searchOpen} />
    </VStack>
  );
}
