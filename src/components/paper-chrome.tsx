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
    <HStack align="center" gap={1}>
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
        <Icon
          icon={SearchMark}
          size="sm"
          color={searchOpen ? "primary" : "secondary"}
        />
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
