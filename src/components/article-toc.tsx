"use client";

import { useEffect, useRef, useState } from "react";
import { useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { Link } from "@astryxdesign/core/Link";
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
  const tocRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const toc = tocRef.current;
    const sentinel = sentinelRef.current;
    if (toc == null || sentinel == null || items.length < MIN_HEADINGS) {
      return;
    }

    const root = toc.closest(".astryx-layout-content");
    const scrollRoot = root instanceof HTMLElement ? root : null;

    const publishHeight = () => {
      if (scrollRoot != null) {
        scrollRoot.style.setProperty(
          "--article-toc-height",
          `${toc.offsetHeight}px`,
        );
      }
    };
    publishHeight();

    const stuckObserver = new IntersectionObserver(
      ([entry]) => {
        setStuck(entry != null && !entry.isIntersecting);
      },
      { root: scrollRoot, threshold: 0 },
    );
    stuckObserver.observe(sentinel);

    const syncActive = () => {
      const line =
        (scrollRoot?.getBoundingClientRect().top ?? 0) + toc.offsetHeight;
      let next = items[0]?.id ?? "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading != null && heading.getBoundingClientRect().top <= line) {
          next = item.id;
        }
      }
      setActiveId((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      publishHeight();
      syncActive();
    };

    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      stuckObserver.disconnect();
      scrollTarget.removeEventListener("scroll", onScroll);
      if (scrollRoot != null) {
        scrollRoot.style.removeProperty("--article-toc-height");
      }
    };
  }, [items]);

  if (items.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <>
      <VStack ref={sentinelRef} gap={0} className="article-toc-sentinel" />
      <VStack
        ref={tocRef}
        gap={2}
        className={stuck ? "article-toc article-toc-stuck" : "article-toc"}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            color={item.id === activeId ? "primary" : "secondary"}
            type="supporting"
            onClick={(event) => {
              event.preventDefault();
              jumpToHeading(item.id);
            }}
          >
            {item.label}
          </Link>
        ))}
      </VStack>
    </>
  );
}
