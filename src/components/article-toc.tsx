"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Outline,
  useOutlineFromMarkdown,
} from "@astryxdesign/core/Outline";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

const MIN_HEADINGS = 3;

export function ArticleToc({ markdown }: { markdown: string }) {
  const items = useOutlineFromMarkdown(markdown);
  const markerRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = markerRef.current?.closest(".astryx-layout-content");
    if (root instanceof HTMLElement) {
      scrollRef.current = root;
    }
    setMounted(true);
  }, []);

  if (items.length < MIN_HEADINGS) {
    return null;
  }

  return (
    <>
      <span ref={markerRef} hidden />
      {mounted
        ? createPortal(
            <aside className="article-toc-dock">
              <VStack gap={4} className="article-toc-panel">
                <Text type="supporting" color="secondary">
                  Contents
                </Text>
                <Outline
                  items={items}
                  density="compact"
                  label="Contents"
                  scrollContainerRef={scrollRef}
                />
              </VStack>
            </aside>,
            document.body,
          )
        : null}
    </>
  );
}
