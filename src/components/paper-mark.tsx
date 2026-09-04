"use client";

import { useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { SearchMark } from "@/components/paper-icons";
import type { Note } from "@/content/types";

export function PaperMark({
  notes,
  children,
}: {
  notes: Note[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <HStack align="center" justify="between" gap={3} className="note-row">
        <Link
          href="/"
          color="secondary"
          onClick={() => setSearchOpen(false)}
        >
          hpcnotes
        </Link>
        <HStack align="center" gap={3}>
          <Link
            color="secondary"
            label="Search thoughts"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Icon icon={SearchMark} size="sm" color="secondary" />
          </Link>
          <Link href="/explore" color="secondary">
            explore
          </Link>
        </HStack>
      </HStack>
      <SearchPalette
        notes={notes}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      >
        {children}
      </SearchPalette>
    </>
  );
}
