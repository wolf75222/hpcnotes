"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Lightbox } from "@astryxdesign/core/Lightbox";

const VIDEO_SRC = /\.(mp4|webm|ogg)(\?|$)/i;
const GIF_SRC = /\.gif(\?|$)/i;

export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const isVideo = VIDEO_SRC.test(src);
  const isGif = GIF_SRC.test(src);

  return (
    <VStack gap={2} as="figure">
      {isVideo ? (
        <video
          className="md-image"
          src={src}
          controls
          playsInline
          preload="metadata"
        >
          {alt}
        </video>
      ) : (
        <button
          type="button"
          className="md-image-trigger"
          aria-haspopup="dialog"
          aria-label={alt ? `Open ${alt}` : "Open image"}
          onClick={() => setOpen(true)}
        >
          {/* Astryx Markdown uses img; GIFs must animate, and there is no Astryx Image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="md-image" />
        </button>
      )}
      {alt ? (
        <Text type="supporting" color="secondary">
          {alt}
        </Text>
      ) : null}
      {open
        ? createPortal(
            <Lightbox
              isOpen={open}
              onOpenChange={setOpen}
              media={{ src, alt, caption: alt, type: "image" }}
              hasZoom={!isGif}
            />,
            document.body,
          )
        : null}
    </VStack>
  );
}
