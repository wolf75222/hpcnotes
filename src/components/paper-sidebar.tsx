"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import {
  buildThoughtForest,
  findThoughtPath,
  flattenThoughtRefs,
} from "@/content/thoughts";

const MIN_HEADINGS = 3;

const HeadingMarkdown = createContext<(markdown: string) => void>(() => undefined);

function jumpToHeading(id: string) {
  const target = document.getElementById(id);
  if (target == null) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function activeSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/notes\/([^/]+)\/?$/);
  return match?.[1] ?? "";
}

export function PaperHeadings({ markdown }: { markdown: string }) {
  const setMarkdown = useContext(HeadingMarkdown);

  useEffect(() => {
    setMarkdown(markdown);
    return () => setMarkdown("");
  }, [markdown, setMarkdown]);

  return null;
}

function ThoughtSidebar({
  notes,
  markdown,
}: {
  notes: NoteIndex[];
  markdown: string;
}) {
  const pathname = usePathname();
  const activeSlug = activeSlugFromPath(pathname);
  const thoughts = useMemo(() => {
    if (activeSlug === "") {
      return [];
    }
    const path = findThoughtPath(buildThoughtForest(notes), activeSlug);
    const root = path?.[0];
    if (root == null || root.children.length === 0) {
      return [];
    }
    return flattenThoughtRefs(root);
  }, [notes, activeSlug]);
  const items = useOutlineFromMarkdown(markdown);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const minLevel = items.reduce(
    (lowest, item) => Math.min(lowest, item.level),
    6,
  );
  const showHeadings = thoughts.length >= 2 && items.length >= MIN_HEADINGS;
  const showTree = thoughts.length >= 2;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showHeadings) {
      return;
    }

    const root = document.querySelector(".astryx-layout-content");
    const scrollRoot = root instanceof HTMLElement ? root : null;

    const syncActive = () => {
      const line = (scrollRoot?.getBoundingClientRect().top ?? 0) + 48;
      let next = items[0]?.id ?? "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading != null && heading.getBoundingClientRect().top <= line) {
          next = item.id;
        }
      }
      setActiveId((current) => (current === next ? current : next));
    };

    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;
    scrollTarget.addEventListener("scroll", syncActive, { passive: true });
    syncActive();

    return () => {
      scrollTarget.removeEventListener("scroll", syncActive);
    };
  }, [items, showHeadings]);

  if (!mounted || !showTree) {
    return null;
  }

  return createPortal(
    <aside className="thought-sidebar">
      <nav className="thought-sidebar-panel" aria-label="Table of contents">
        <VStack gap={8}>
          <VStack gap={1}>
            {thoughts.map((item) => (
              <a
                key={item.slug}
                href={`/notes/${item.slug}`}
                className="thought-sidebar-link"
                data-depth={String(Math.min(item.depth, 3))}
                data-active={item.slug === activeSlug ? "true" : "false"}
              >
                {item.title}
              </a>
            ))}
          </VStack>
          {showHeadings ? (
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Contents
              </Text>
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="thought-sidebar-link"
                  data-depth={String(Math.min(item.level - minLevel, 3))}
                  data-active={item.id === activeId ? "true" : "false"}
                  onClick={(event) => {
                    event.preventDefault();
                    jumpToHeading(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </VStack>
          ) : null}
        </VStack>
      </nav>
    </aside>,
    document.body,
  );
}

export function PaperSidebar({
  notes,
  children,
}: {
  notes: NoteIndex[];
  children: React.ReactNode;
}) {
  const [markdown, setMarkdown] = useState("");

  return (
    <HeadingMarkdown.Provider value={setMarkdown}>
      <ThoughtSidebar notes={notes} markdown={markdown} />
      {children}
    </HeadingMarkdown.Provider>
  );
}
