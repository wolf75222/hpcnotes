"use client";

import { useState } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Stack";
import { SearchPalette } from "@/components/search-palette";
import { SearchMark, TagsMark } from "@/components/paper-icons";
import type { Note } from "@/content/types";

export function PaperMark({ notes }: { notes: Note[] }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <HStack align="center" justify="between" gap={3} className="note-row">
        <Link href="/" color="secondary" display="block">
          hpcnotes
        </Link>
        <HStack align="center" gap={1}>
          <IconButton
            label="Search thoughts"
            tooltip="Search"
            variant="ghost"
            size="sm"
            icon={<Icon icon={SearchMark} size="sm" color="secondary" />}
            onClick={() => setSearchOpen(true)}
          />
          <IconButton
            label="Browse tags"
            tooltip="Tags"
            variant="ghost"
            size="sm"
            href="/explore"
            icon={<Icon icon={TagsMark} size="sm" color="secondary" />}
          />
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
