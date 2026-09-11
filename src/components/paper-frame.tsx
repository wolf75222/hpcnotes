"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
} from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import {
  buildThoughtForest,
  findThoughtPath,
  flattenThoughtRefs,
  isNoteDocument,
} from "@/content/thoughts";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";
import { PaperTools, PaperWordmark } from "@/components/paper-chrome";
import { PaperMark } from "@/components/paper-mark";
import { SearchPalette } from "@/components/search-palette";

function activeSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/notes\/([^/]+)\/?$/);
  const slug = safeDecodeParam(match?.[1] ?? "");
  return isNoteSlug(slug) ? slug : "";
}

function NoteBar({
  pages,
  activeSlug,
}: {
  pages: { slug: string; title: string; depth: number }[];
  activeSlug: string;
}) {
  return (
    <VStack gap={8}>
      <PaperWordmark />
      <nav aria-label="Contents">
        <VStack gap={0}>
          {pages.map((page) => {
            const active = page.slug === activeSlug;
            return (
              <Link
                key={page.slug}
                href={`/notes/${page.slug}`}
                color={active || page.depth === 0 ? "primary" : "secondary"}
                type="supporting"
                weight={active || page.depth === 0 ? "semibold" : "normal"}
                display="block"
                className="note-toc-page"
                data-depth={String(Math.min(page.depth, 3))}
                data-active={active ? "true" : "false"}
              >
                {page.title}
              </Link>
            );
          })}
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
  const isNoteDoc = pages.length >= 2;

  const onSearchOpenChange = (open: boolean) => {
    setSearchOpen(open);
    if (!open) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  };

  const tools = (
    <PaperTools
      searchOpen={searchOpen}
      onSearchOpenChange={onSearchOpenChange}
      searchButtonRef={searchButtonRef}
    />
  );

  if (!isNoteDoc) {
    return (
      <Layout
        height="auto"
        contentWidth={640}
        padding={6}
        defaultHasDividers={false}
        content={
          <LayoutContent isScrollable={false}>
            <VStack gap={10} className="paper-sheet" paddingBlockEnd={10}>
              <PaperMark notes={notes}>{children}</PaperMark>
            </VStack>
          </LayoutContent>
        }
      />
    );
  }

  return (
    <Layout
      height="fill"
      padding={0}
      defaultHasDividers={false}
      className="note-frame"
      start={
        <LayoutPanel
          width={280}
          hasDivider
          padding={6}
          isScrollable
          role="navigation"
          label="Contents"
          className="note-toc-panel"
        >
          <NoteBar pages={pages} activeSlug={activeSlug} />
        </LayoutPanel>
      }
      content={
        <LayoutContent padding={0} isScrollable={false}>
          <Layout
            height="fill"
            padding={0}
            defaultHasDividers={false}
            header={
              <LayoutHeader hasDivider={false} className="note-article-header">
                <HStack align="center" paddingInline={8} paddingBlockStart={4}>
                  <HStack className="note-wordmark-inline">
                    <PaperWordmark onHome={() => onSearchOpenChange(false)} />
                  </HStack>
                  <StackItem size="fill" />
                  {tools}
                </HStack>
              </LayoutHeader>
            }
            content={
              <LayoutContent padding={8} isScrollable>
                <VStack maxWidth={640} className="note-article-column">
                  <SearchPalette
                    notes={notes}
                    open={searchOpen}
                    onOpenChange={onSearchOpenChange}
                  >
                    {children}
                  </SearchPalette>
                </VStack>
              </LayoutContent>
            }
          />
        </LayoutContent>
      }
    />
  );
}
