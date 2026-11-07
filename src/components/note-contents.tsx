"use client";

import { useMemo, useState } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { LeaderRow } from "@/components/leader-row";
import { DiscloseMark, DiscloseOpenMark } from "@/components/paper-icons";
import { defaultExpandedSlugs, visibleContents } from "@/content/thoughts";
import type { ThoughtRef } from "@/content/types";

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

  // Inside a page the contents start folded: the text comes first, and
  // previous / next sit at the end.
  const [listOpen, setListOpen] = useState(() => activeSlug == null);

  if (pages.length < 2) {
    return null;
  }

  const collapsible = activeSlug != null;
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
    return <nav aria-label="Contents" className="note-contents-nav">{toggleRow}</nav>;
  }

  return (
    <nav aria-label="Contents" className="note-contents-nav">
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
