"use client";

import { useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { ExploreMark, SearchMark } from "@/components/paper-icons";
import type { NoteIndex } from "@/content/types";

export function PaperMark({
  notes,
  children,
}: {
  notes: NoteIndex[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <VStack gap={0}>
      <HStack align="center" justify="between" gap={3} className="note-row">
        <Link
          href="/"
          color="secondary"
          type="supporting"
          onClick={() => setSearchOpen(false)}
        >
          hpcnotes
        </Link>
        <HStack align="center" gap={3}>
          <Link
            color="secondary"
            type="supporting"
            label="Search thoughts"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Icon icon={SearchMark} size="sm" color="secondary" />
          </Link>
          <Link
            href="/explore"
            color="secondary"
            type="supporting"
            label="Explore"
            onClick={() => setSearchOpen(false)}
          >
            <Icon icon={ExploreMark} size="sm" color="secondary" />
          </Link>
        </HStack>
      </HStack>
      <div className="paper-below-mark">
        <SearchPalette
          notes={notes}
          open={searchOpen}
          onOpenChange={setSearchOpen}
        >
          {children}
        </SearchPalette>
      </div>
    </VStack>
  );
}
