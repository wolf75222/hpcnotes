"use client";

import { useRef, useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { ExploreMark, SearchMark } from "@/components/paper-icons";
import { PaperSidebar } from "@/components/paper-sidebar";
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

  const onSearchOpenChange = (open: boolean) => {
    setSearchOpen(open);
    if (!open) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  };

  return (
    <PaperSidebar notes={notes}>
      <VStack gap={0}>
        <HStack align="center" justify="between" gap={3} className="note-row">
          <Link
            href="/"
            color="secondary"
            type="supporting"
            onClick={() => onSearchOpenChange(false)}
          >
            hpcnotes
          </Link>
          <HStack align="center" gap={1}>
            <Link
              ref={searchButtonRef}
              className="paper-mark-action"
              color="secondary"
              type="supporting"
              label="Search thoughts"
              aria-expanded={searchOpen}
              aria-controls={searchOpen ? "paper-search" : undefined}
              onClick={() => onSearchOpenChange(!searchOpen)}
            >
              <Icon icon={SearchMark} size="sm" color="secondary" />
            </Link>
            <Link
              href="/explore"
              className="paper-mark-action"
              color="secondary"
              type="supporting"
              label="Explore"
              onClick={() => onSearchOpenChange(false)}
            >
              <Icon icon={ExploreMark} size="sm" color="secondary" />
            </Link>
          </HStack>
        </HStack>
        <VStack gap={0} className="paper-below-mark">
          <SearchPalette
            notes={notes}
            open={searchOpen}
            onOpenChange={onSearchOpenChange}
          >
            {children}
          </SearchPalette>
        </VStack>
      </VStack>
    </PaperSidebar>
  );
}
