"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { ThoughtRef } from "@/content/types";

const MIN_HEADINGS = 3;

function jumpToHeading(id: string) {
  const target = document.getElementById(id);
  if (target == null) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function PaperDock({
  markdown,
  thoughts,
  activeSlug,
}: {
  markdown: string;
  thoughts: ThoughtRef[];
  activeSlug: string;
}) {
  const items = useOutlineFromMarkdown(markdown);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const minLevel = items.reduce(
    (lowest, item) => Math.min(lowest, item.level),
    6,
  );
  const showHeadings = items.length >= MIN_HEADINGS;
  const showTree = thoughts.length >= 2;
  const showDock = showTree || showHeadings;

  useEffect(() => {
    if (!showDock) {
      return;
    }

    const root = markerRef.current?.closest(".astryx-layout-content");
    const scrollRoot = root instanceof HTMLElement ? root : null;
    setMounted(true);

    if (!showHeadings) {
      return;
    }

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
  }, [items, showDock, showHeadings]);

  if (!showDock) {
    return null;
  }

  return (
    <>
      <span ref={markerRef} hidden />
      {mounted
        ? createPortal(
            <aside className="article-toc-dock">
              <nav className="article-toc-panel" aria-label="Notes">
                <VStack gap={6}>
                  {showTree ? (
                    <VStack gap={2}>
                      {thoughts.map((item) => (
                        <a
                          key={item.slug}
                          href={`/notes/${item.slug}`}
                          className="article-toc-link"
                          data-depth={String(Math.min(item.depth, 3))}
                          data-active={item.slug === activeSlug ? "true" : "false"}
                        >
                          {item.title}
                        </a>
                      ))}
                    </VStack>
                  ) : null}
                  {showHeadings ? (
                    <VStack gap={2}>
                      <Text type="supporting" color="secondary">
                        Contents
                      </Text>
                      {items.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="article-toc-link"
                          data-depth={String(item.level - minLevel)}
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
          )
        : null}
    </>
  );
}
