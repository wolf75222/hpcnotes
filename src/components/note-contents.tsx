"use client";

import { useMemo, useState } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { LeaderRow } from "@/components/leader-row";
import { DiscloseMark, DiscloseOpenMark } from "@/components/paper-icons";
import { defaultExpandedSlugs, visibleContents } from "@/content/thoughts";
import type { ThoughtRef } from "@/content/types";

/** Inside a note, a contents list longer than this starts folded. */
const LONG_CONTENTS = 8;

export function NoteContents({
  pages,
  activeSlug,
}: {
  pages: ThoughtRef[];
  activeSlug?: string;
}) {
  const [expanded, setExpanded] = useState(
    () => new Set(defaultExpandedSlugs(pages, activeSlug)),
  );
  const showDisclosure = pages.some((page) => page.hasChildren);
  const visible = useMemo(
    () => (showDisclosure ? visibleContents(pages, expanded) : pages),
    [pages, expanded, showDisclosure],
  );

  const [listOpen, setListOpen] = useState(
    () => activeSlug == null || visible.length <= LONG_CONTENTS,
  );

  if (pages.length < 2) {
    return null;
  }

  const collapsible = activeSlug != null && visible.length > LONG_CONTENTS;
  const position = pages.findIndex((page) => page.slug === activeSlug);

  function toggle(slug: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  const toggleRow = collapsible ? (
    <Link
      className="note-contents-toggle"
      color="secondary"
      type="supporting"
      aria-expanded={listOpen}
      aria-controls="note-contents-list"
      onClick={() => setListOpen((open) => !open)}
    >
      <HStack as="span" gap={1} align="center">
        <Icon
          icon={listOpen ? DiscloseOpenMark : DiscloseMark}
          size="xsm"
          color="inherit"
        />
        <span>
          {position >= 0
            ? `Contents · ${position + 1} of ${pages.length}`
            : `Contents · ${pages.length}`}
        </span>
      </HStack>
    </Link>
  ) : null;

  if (collapsible && !listOpen) {
    return <nav aria-label="Contents">{toggleRow}</nav>;
  }

  return (
    <nav aria-label="Contents">
      {toggleRow}
      <VStack gap={3} id="note-contents-list">
        {visible.map((page) => {
          const open = expanded.has(page.slug);
          return (
            <LeaderRow
              key={page.slug}
              href={page.slug === activeSlug ? undefined : `/notes/${page.slug}`}
              isCurrent={page.slug === activeSlug}
              label={page.title}
              meta={page.label}
              depth={page.depth}
              mark={
                page.hasChildren ? (
                  <Link
                    className="note-disclose"
                    color="inherit"
                    type="supporting"
                    label={open ? `Collapse ${page.title}` : `Expand ${page.title}`}
                    aria-expanded={open}
                    onClick={() => toggle(page.slug)}
                  >
                    <Icon
                      icon={open ? DiscloseOpenMark : DiscloseMark}
                      size="xsm"
                      color="inherit"
                    />
                  </Link>
                ) : undefined
              }
            />
          );
        })}
      </VStack>
    </nav>
  );
}
