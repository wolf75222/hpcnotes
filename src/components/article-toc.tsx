"use client";

import { useEffect, useRef, useState } from "react";
import { useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";

const MIN_HEADINGS = 3;

export function ArticleToc({ markdown }: { markdown: string }) {
  const items = useOutlineFromMarkdown(markdown);
  const sentinelRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel == null || items.length < MIN_HEADINGS) {
      return;
    }

    const root = sentinel.closest(".astryx-layout-content");
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(entry != null && !entry.isIntersecting);
      },
      {
        root: root instanceof Element ? root : null,
        threshold: 0,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  if (items.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <>
      <VStack
        className={stuck ? "article-toc article-toc-stuck" : "article-toc"}
        gap={2}
      >
        {items.map((item) => (
          <Link key={item.id} href={`#${item.id}`} color="secondary">
            {item.label}
          </Link>
        ))}
      </VStack>
      <VStack ref={sentinelRef} gap={0} className="article-toc-sentinel" />
    </>
  );
}
