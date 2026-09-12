"use client";

import { useMemo, useState } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { LeaderRow } from "@/components/leader-row";
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

  if (pages.length < 2) {
    return null;
  }

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

  return (
    <nav aria-label="Contents">
      <VStack gap={3}>
        {visible.map((page) => {
          const open = expanded.has(page.slug);
          return (
            <LeaderRow
              key={page.slug}
              href={page.slug === activeSlug ? undefined : `/notes/${page.slug}`}
              label={page.title}
              meta={page.label}
              depth={page.depth}
              start={
                showDisclosure ? (
                  page.hasChildren ? (
                    <Link
                      className="paper-mark-action"
                      color={open ? "primary" : "secondary"}
                      type="supporting"
                      label={open ? `Collapse ${page.title}` : `Expand ${page.title}`}
                      aria-expanded={open}
                      onClick={() => toggle(page.slug)}
                    >
                      <Icon
                        icon={open ? "chevronDown" : "chevronRight"}
                        size="sm"
                        color={open ? "primary" : "secondary"}
                      />
                    </Link>
                  ) : (
                    <span className="paper-mark-action" aria-hidden="true" />
                  )
                ) : undefined
              }
            />
          );
        })}
      </VStack>
    </nav>
  );
}
