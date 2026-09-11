"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { Layout, LayoutContent, LayoutPanel } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import {
  Outline,
  useOutlineFromMarkdown,
} from "@astryxdesign/core/Outline";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import type { NoteIndex } from "@/content/types";
import {
  buildThoughtForest,
  findThoughtPath,
  flattenThoughtRefs,
  isNoteDocument,
} from "@/content/thoughts";
import { isNoteSlug, safeDecodeParam } from "@/lib/slugs";
import { PaperMark } from "@/components/paper-mark";

const MIN_HEADINGS = 3;
const TOC_QUERY = "(min-width: 64rem)";

const HeadingMarkdown = createContext<(markdown: string) => void>(
  () => undefined,
);

function activeSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/notes\/([^/]+)\/?$/);
  const slug = safeDecodeParam(match?.[1] ?? "");
  return isNoteSlug(slug) ? slug : "";
}

export function PaperHeadings({ markdown }: { markdown: string }) {
  const setMarkdown = useContext(HeadingMarkdown);

  useEffect(() => {
    setMarkdown(markdown);
    return () => setMarkdown("");
  }, [markdown, setMarkdown]);

  return null;
}

function NoteToc({
  pages,
  activeSlug,
  headings,
}: {
  pages: { slug: string; title: string; depth: number }[];
  activeSlug: string;
  headings: { id: string; label: string; level: number }[];
}) {
  return (
    <VStack gap={8} className="note-toc">
      {pages.length >= 2 ? (
        <nav aria-label="Pages">
          <VStack gap={1}>
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
      ) : null}
      {headings.length >= MIN_HEADINGS ? (
        <VStack gap={3}>
          <Text type="supporting" color="secondary">
            Contents
          </Text>
          <Outline items={headings} density="compact" label="On this page" />
        </VStack>
      ) : null}
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
  const [markdown, setMarkdown] = useState("");
  const wide = useMediaQuery(TOC_QUERY);
  const activeSlug = activeSlugFromPath(pathname);
  const headings = useOutlineFromMarkdown(markdown);
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
  const showPages = pages.length >= 2;
  const showHeadings = headings.length >= MIN_HEADINGS;
  const showToc = wide && activeSlug !== "" && (showPages || showHeadings);

  return (
    <HeadingMarkdown.Provider value={setMarkdown}>
      <Layout
        height="auto"
        contentWidth={640}
        padding={6}
        defaultHasDividers={false}
        end={
          showToc ? (
            <LayoutPanel
              width={260}
              hasDivider={false}
              padding={5}
              isScrollable
              label="Table of contents"
              className="note-toc-panel"
            >
              <NoteToc
                pages={showPages ? pages : []}
                activeSlug={activeSlug}
                headings={showHeadings ? headings : []}
              />
            </LayoutPanel>
          ) : undefined
        }
        content={
          <LayoutContent isScrollable={false}>
            <VStack gap={10} className="paper-sheet" paddingBlockEnd={10}>
              <PaperMark notes={notes}>{children}</PaperMark>
            </VStack>
          </LayoutContent>
        }
      />
    </HeadingMarkdown.Provider>
  );
}
