"use client";

import { useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { SearchMark } from "@/components/paper-icons";
import type { Note } from "@/content/types";

export function PaperMark({ notes }: { notes: Note[] }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <HStack align="center" justify="between" gap={3} className="note-row">
        <Link href="/" color="secondary" type="supporting" display="block">
          hpcnotes
        </Link>
        <HStack align="center" gap={3}>
          <IconButton
            label="Search thoughts"
            variant="ghost"
            size="sm"
            icon={<Icon icon={SearchMark} size="sm" color="secondary" />}
            onClick={() => setSearchOpen(true)}
          />
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
