"use client";

import { useEffect, useId, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

export function MermaidBlock({ chart }: { chart: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = `mermaid-${reactId.replace(/:/g, "")}`;
    let cancelled = false;

    void import("mermaid")
      .then(async (mod) => {
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
          fontFamily: "var(--font-family-body)",
        });
        return mermaid.render(id, chart.trim());
      })
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSvg(null);
          setError("Diagram failed to render. Check the mermaid source.");
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
          // Mermaid returns an SVG document; keep it in React so re-renders do not wipe it.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </VStack>
  );
}
