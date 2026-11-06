"use client";

import { useMemo, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { useDeferredLightbox } from "@/components/media-lightbox";
import { figureAlt, hasCaption } from "@/lib/figure-alt";
import { isSafeLocalMediaSrc, isSafeMediaSrc, mediaPathname } from "@/lib/media";
import mediaManifest from "@/content/media-manifest.json";

const VIDEO_SRC = /\.(mp4|webm|ogg)$/i;
const GIF_SRC = /\.gif$/i;

interface MediaInfo {
  width: number;
  height: number;
  avif?: { src: string; bytes: number };
  webp?: { src: string; bytes: number };
}

const MEDIA = mediaManifest as Record<string, MediaInfo>;

/**
 * Local images come with their intrinsic size (no layout shift) and, for
 * PNG/JPEG, AVIF/WebP versions made at build time. GIFs stay animated and
 * SVG stays vector. Remote images load as they are.
 */
function RasterOrFile({
  src,
  alt,
  onReady,
}: {
  src: string;
  alt: string;
  onReady: () => void;
}) {
  const info = isSafeLocalMediaSrc(src) ? MEDIA[src] : undefined;
  const sources = [
    info?.avif ? { type: "image/avif", ...info.avif } : null,
    info?.webp ? { type: "image/webp", ...info.webp } : null,
  ]
    .filter((item) => item != null)
    .sort((a, b) => a.bytes - b.bytes);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={info?.width || undefined}
      height={info?.height || undefined}
      className="md-image"
      decoding="async"
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={onReady}
      onError={onReady}
    />
  );

  if (sources.length === 0) {
    return img;
  }
  return (
    <picture>
      {sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.src} />
      ))}
      {img}
    </picture>
  );
}

export function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const safe = isSafeMediaSrc(src);
  const path = mediaPathname(src);
  const isVideo = safe && VIDEO_SRC.test(path);
  const isGif = safe && GIF_SRC.test(path);
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
            onReady={() => setReady(true)}
          />
        </VStack>
      </button>
      {caption ? <Text color="secondary">{alt.trim()}</Text> : null}
      {element}
    </VStack>
  );
}
