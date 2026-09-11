"use client";

import type { Ref } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Stack";
import { ExploreMark, SearchMark } from "@/components/paper-icons";

export function PaperChrome({
  searchOpen,
  onSearchOpenChange,
  searchButtonRef,
}: {
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  searchButtonRef?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}) {
  return (
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
          label="Search notes"
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
  );
}
