"use client";

import { useEffect, useMemo, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import {
  mermaidSvgObjectUrl,
  prefetchMermaid,
  renderMermaidChart,
} from "@/lib/load-mermaid";
import { useDeferredLightbox } from "@/components/media-lightbox";

export function MermaidBlock({ chart }: { chart: string }) {
  prefetchMermaid();

  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    () => (svg == null ? "" : mermaidSvgObjectUrl(svg)),
    [svg],
  );

  useEffect(() => {
    if (src === "") {
      return;
    }
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [src]);

  const { openLightbox, element } = useDeferredLightbox(
    { src, alt: "Diagram", caption: "Diagram", type: "image" },
    true,
  );

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
