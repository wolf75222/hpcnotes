"use client";

import { useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { SearchMark } from "@/components/paper-icons";
import type { Note } from "@/content/types";

export function PaperMark({ notes }: { notes: Note[] }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <HStack align="center" justify="between" gap={3} className="note-row">
        <Link href="/" color="secondary" type="supporting">
          hpcnotes
        </Link>
        <HStack align="center" gap={3}>
          <Link
            color="secondary"
            type="supporting"
            label="Search thoughts"
            onClick={() => setSearchOpen(true)}
          >
            <Icon icon={SearchMark} size="sm" color="secondary" />
          </Link>
          <Link href="/explore" color="secondary" type="supporting">
            explore
          </Link>
        </HStack>
      </HStack>
      <SearchPalette
        notes={notes}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </>
  );
}
