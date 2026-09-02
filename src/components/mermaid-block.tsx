"use client";

import { useEffect, useId, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { renderMermaidChart } from "@/lib/load-mermaid";

export function MermaidBlock({ chart }: { chart: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = `mermaid-${reactId.replace(/:/g, "")}`;
    let cancelled = false;

    void renderMermaidChart(id, chart)
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
  }, [chart, reactId]);

  if (error) {
    return <Text color="secondary">{error}</Text>;
  }

  return (
    <VStack gap={2}>
      {svg == null ? (
        <Text color="secondary">Rendering diagram…</Text>
      ) : (
        <figure
          className="md-mermaid"
          aria-label="Diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </VStack>
  );
}
