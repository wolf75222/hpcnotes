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

export function MermaidBlock({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    prefetchMermaid();
  }, []);

  useEffect(() => {
    let cancelled = false;

    void renderMermaidChart(chart)
      .then((rendered) => {
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setSvg(null);
          setError(
            caught instanceof Error
              ? caught.message
              : "Diagram failed to render.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  const src = useMemo(
    () => (svg == null ? "" : mermaidSvgDataUrl(svg)),
    [svg],
  );
  const media = useMemo(
    () => ({ src, alt: "Diagram", caption: "Diagram", type: "image" as const }),
    [src],
  );
  const { openLightbox, element } = useDeferredLightbox(media, true);

  if (error) {
    return <Text color="secondary">{error}</Text>;
  }

  return (
    <VStack gap={2}>
      {svg == null ? (
        <Text color="secondary">Rendering diagram…</Text>
      ) : (
        <>
          <button
            type="button"
            className="md-image-trigger"
            aria-haspopup="dialog"
            aria-label="Open diagram"
            onClick={openLightbox}
          >
            <figure
              className="md-mermaid"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </button>
          {src ? element : null}
        </>
      )}
    </VStack>
  );
}
