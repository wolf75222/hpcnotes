"use client";

import type { Ref } from "react";
import { Link } from "@astryxdesign/core/Link";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Stack";
import { ExploreMark, SearchMark } from "@/components/paper-icons";

export function PaperWordmark({ onHome }: { onHome?: () => void }) {
  return (
    <Link href="/" color="secondary" type="supporting" onClick={onHome}>
      hpcnotes
    </Link>
  );
}

export function PaperTools({
  searchOpen,
  onSearchOpenChange,
  searchButtonRef,
}: {
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  searchButtonRef?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}) {
  return (
    <HStack align="center" gap={4}>
      <Link
        ref={searchButtonRef}
        className="paper-mark-action"
        color={searchOpen ? "primary" : "secondary"}
        type="supporting"
        label="Search notes"
        aria-expanded={searchOpen}
        aria-pressed={searchOpen}
        aria-controls={searchOpen ? "paper-search" : undefined}
        onClick={() => onSearchOpenChange(!searchOpen)}
      >
        <HStack as="span" align="center" gap={1}>
          <Icon
            icon={SearchMark}
            size="xsm"
            color={searchOpen ? "primary" : "secondary"}
          />
          <span>Search</span>
          <kbd className="paper-kbd" aria-hidden>
            /
          </kbd>
        </HStack>
      </Link>
      <Link
        href="/explore"
        className="paper-mark-action"
        color="secondary"
        type="supporting"
        label="Explore"
        onClick={() => onSearchOpenChange(false)}
      >
        <HStack as="span" align="center" gap={1}>
          <Icon icon={ExploreMark} size="xsm" color="secondary" />
          <span>Explore</span>
        </HStack>
      </Link>
    </HStack>
  );
}

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
      <PaperWordmark onHome={() => onSearchOpenChange(false)} />
      <PaperTools
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchButtonRef={searchButtonRef}
      />
    </HStack>
  );
}
