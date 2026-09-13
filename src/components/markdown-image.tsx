"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { useDeferredLightbox } from "@/components/media-lightbox";
import { figureAlt, hasCaption } from "@/lib/figure-alt";
import {
  isCompressibleRasterSrc,
  isSafeMediaSrc,
  mediaPathname,
} from "@/lib/media";

const VIDEO_SRC = /\.(mp4|webm|ogg)$/i;
const GIF_SRC = /\.gif$/i;
const SIZES = "(max-width: 40rem) 100vw, 640px";

function RasterOrFile({
  src,
  alt,
  compress,
  onReady,
}: {
  src: string;
  alt: string;
  compress: boolean;
  onReady: () => void;
}) {
  const className = "md-image";

  if (compress) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes={SIZES}
        quality={75}
        className={className}
        style={{ width: "100%", height: "auto" }}
        onLoad={onReady}
        onError={onReady}
      />
    );
  }

  return (
    // GIFs must animate; SVG stays vector. Next/Image would freeze or rasterize them.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={onReady}
      onError={onReady}
    />
  );
}

export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const safe = isSafeMediaSrc(src);
  const path = mediaPathname(src);
  const isVideo = safe && VIDEO_SRC.test(path);
  const isGif = safe && GIF_SRC.test(path);
  const compress = safe && isCompressibleRasterSrc(src);
  const label = figureAlt(
    alt,
    isVideo ? "Video" : isGif ? "Animation" : "Figure",
  );
  const caption = hasCaption(alt);
  const [ready, setReady] = useState(false);
  const media = useMemo(
    () => ({ src, alt: label, type: "image" as const }),
    [src, label],
  );
  const { openLightbox, element } = useDeferredLightbox(media, !isGif);

  if (!safe) {
    return caption ? <Text color="secondary">{alt.trim()}</Text> : null;
  }

  if (isVideo) {
    return (
      <VStack gap={1} as="figure">
        <video
          className="md-image"
          src={src}
          controls
          playsInline
          preload="metadata"
          aria-label={label}
          title={label}
        >
          {label}
        </video>
        {caption ? <Text color="secondary">{alt.trim()}</Text> : null}
      </VStack>
    );
  }

  return (
    <VStack gap={1} as="figure">
      <button
        type="button"
        className="md-image-trigger"
        aria-haspopup="dialog"
        aria-label={`Open ${label}`}
        onClick={openLightbox}
      >
        <VStack
          gap={0}
          className={ready ? "md-image-slot is-ready" : "md-image-slot"}
        >
          <RasterOrFile
            src={src}
            alt={label}
            compress={compress}
            onReady={() => setReady(true)}
          />
        </VStack>
      </button>
      {caption ? <Text color="secondary">{alt.trim()}</Text> : null}
      {element}
    </VStack>
  );
}
