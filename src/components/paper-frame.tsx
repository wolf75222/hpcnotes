"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Layout, LayoutContent, LayoutPanel } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import type { NoteIndex } from "@/content/types";
import {
  buildThoughtForest,
  findThoughtPath,
  flattenThoughtRefs,
  isNoteDocument,
} from "@/content/thoughts";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";
import { PaperChrome } from "@/components/paper-chrome";
import { PaperMark } from "@/components/paper-mark";
import { SearchPalette } from "@/components/search-palette";

const TOC_QUERY = "(min-width: 64rem)";

function activeSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/notes\/([^/]+)\/?$/);
  const slug = safeDecodeParam(match?.[1] ?? "");
  return isNoteSlug(slug) ? slug : "";
}

function NoteBar({
  pages,
  activeSlug,
  searchOpen,
  onSearchOpenChange,
  searchButtonRef,
}: {
  pages: { slug: string; title: string; depth: number }[];
  activeSlug: string;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  searchButtonRef: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
}) {
  return (
    <VStack gap={6}>
      <PaperChrome
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchButtonRef={searchButtonRef}
      />
      <nav aria-label="Contents">
        <VStack gap={0}>
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/notes/${page.slug}`}
              color={page.slug === activeSlug ? "primary" : "secondary"}
              type="supporting"
              display="block"
              className="note-toc-page"
              data-depth={String(Math.min(page.depth, 3))}
              data-active={page.slug === activeSlug ? "true" : "false"}
            >
              {page.title}
            </Link>
          ))}
        </VStack>
      </nav>
    </VStack>
  );
}

export function PaperFrame({
  notes,
  children,
}: {
  notes: NoteIndex[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const wide = useMediaQuery(TOC_QUERY);
  const activeSlug = activeSlugFromPath(pathname);
  const pages = useMemo(() => {
    if (activeSlug === "") {
      return [];
    }
    const path = findThoughtPath(buildThoughtForest(notes), activeSlug);
    const root = path?.[0];
    if (root == null || !isNoteDocument(root)) {
      return [];
    }
    return flattenThoughtRefs(root);
  }, [notes, activeSlug]);
  const showNoteBar = wide && pages.length >= 2;

  const onSearchOpenChange = (open: boolean) => {
    setSearchOpen(open);
    if (!open) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  };

  return (
    <Layout
      height="auto"
      contentWidth={640}
      padding={6}
      defaultHasDividers={false}
      start={
        showNoteBar ? (
          <LayoutPanel
            width={260}
            hasDivider={false}
            padding={5}
            isScrollable
            label="Contents"
            className="note-toc-panel"
          >
            <NoteBar
              pages={pages}
              activeSlug={activeSlug}
              searchOpen={searchOpen}
              onSearchOpenChange={onSearchOpenChange}
              searchButtonRef={searchButtonRef}
            />
          </LayoutPanel>
        ) : undefined
      }
      content={
        <LayoutContent isScrollable={false}>
          <VStack gap={10} className="paper-sheet" paddingBlockEnd={10}>
            {showNoteBar ? (
              <SearchPalette
                notes={notes}
                open={searchOpen}
                onOpenChange={onSearchOpenChange}
              >
                {children}
              </SearchPalette>
            ) : (
              <PaperMark notes={notes}>{children}</PaperMark>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
