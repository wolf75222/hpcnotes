"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import {
  mermaidSvgDataUrl,
  prefetchMermaid,
  renderMermaidChart,
} from "@/lib/load-mermaid";
import { useDeferredLightbox } from "@/components/media-lightbox";

const MAX_CHART = 12_000;

export function MermaidBlock({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tooLong = chart.length > MAX_CHART;

  useEffect(() => {
    if (tooLong) {
      return;
    }
    prefetchMermaid();
    let cancelled = false;

    void renderMermaidChart(chart)
      .then((rendered) => {
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSvg(null);
          setError("Diagram failed to render.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, tooLong]);

  const src = useMemo(
    () => (svg == null ? "" : mermaidSvgDataUrl(svg)),
    [svg],
  );
  const media = useMemo(
    () => ({ src, alt: "Diagram", type: "image" as const }),
    [src],
  );
  const { openLightbox, element } = useDeferredLightbox(media, true);

  if (tooLong || error) {
    return (
      <Text type="supporting" color="secondary">
        {tooLong ? "Diagram is too large to render." : error}
      </Text>
    );
  }

  if (svg == null || src === "") {
    return (
      <Text type="supporting" color="secondary">
        Drawing the diagram…
      </Text>
    );
  }

  return (
    <VStack gap={1}>
      <button
        type="button"
        className="md-image-trigger"
        aria-haspopup="dialog"
        aria-label="Open diagram"
        onClick={openLightbox}
      >
        <figure className="md-mermaid">
          {/* Sandboxed SVG via data URL; never inject mermaid markup. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Diagram" className="md-image" decoding="async" />
        </figure>
      </button>
      {element}
    </VStack>
  );
}
