"use client";

import { useMemo } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { useDeferredLightbox } from "@/components/media-lightbox";

const VIDEO_SRC = /\.(mp4|webm|ogg)(\?|$)/i;
const GIF_SRC = /\.gif(\?|$)/i;

export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const isVideo = VIDEO_SRC.test(src);
  const isGif = GIF_SRC.test(src);
  const media = useMemo(
    () => ({ src, alt, type: "image" as const }),
    [src, alt],
  );
  const { openLightbox, element } = useDeferredLightbox(media, !isGif);

  return (
    <VStack gap={1} as="figure">
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
          onClick={openLightbox}
        >
          {/* Astryx Markdown uses img; GIFs must animate, and there is no Astryx Image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="md-image" />
        </button>
      )}
      {alt ? <Text color="secondary">{alt}</Text> : null}
      {isVideo ? null : element}
    </VStack>
  );
}
