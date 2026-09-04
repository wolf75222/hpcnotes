"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

const MIN_HEADINGS = 3;

function jumpToHeading(id: string) {
  const target = document.getElementById(id);
  if (target == null) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ArticleToc({ markdown }: { markdown: string }) {
  const items = useOutlineFromMarkdown(markdown);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const minLevel = items.reduce(
    (lowest, item) => Math.min(lowest, item.level),
    6,
  );

  useEffect(() => {
    if (items.length < MIN_HEADINGS) {
      return;
    }

    const root = markerRef.current?.closest(".astryx-layout-content");
    const scrollRoot = root instanceof HTMLElement ? root : null;
    setMounted(true);

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
  }, [items]);

  if (items.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <>
      <span ref={markerRef} hidden />
      {mounted
        ? createPortal(
            <aside className="article-toc-dock">
              <nav className="article-toc-panel" aria-label="Contents">
                <VStack gap={3}>
                  <Text type="supporting" color="secondary">
                    Contents
                  </Text>
                  <VStack gap={2}>
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
                </VStack>
              </nav>
            </aside>,
            document.body,
          )
        : null}
    </>
  );
}
