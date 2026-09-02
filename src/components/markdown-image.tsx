"use client";

import { useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Lightbox } from "@astryxdesign/core/Lightbox";

export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <VStack gap={2} as="figure">
      <VStack
        as="button"
        className="md-image-trigger"
        onClick={() => setOpen(true)}
      >
        {/* Astryx Markdown uses img; GIFs must animate, and there is no Astryx Image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="md-image" />
      </VStack>
      {alt ? (
        <Text type="supporting" color="secondary">
          {alt}
        </Text>
      ) : null}
      <Lightbox
        isOpen={open}
        onOpenChange={setOpen}
        media={{ src, alt, caption: alt }}
        hasZoom
      />
    </VStack>
  );
}
