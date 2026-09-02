"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

export function MermaidBlock({ chart }: { chart: string }) {
  const reactId = useId();
  const hostRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const id = `mermaid-${reactId.replace(/:/g, "")}`;
    let cancelled = false;

    void import("mermaid")
      .then((mod) => {
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
          fontFamily: "var(--font-family-body)",
        });
        return mermaid.render(id, chart);
      })
      .then(({ svg }) => {
        if (cancelled || hostRef.current == null) {
          return;
        }
        hostRef.current.innerHTML = svg;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (status === "error") {
    return (
      <Text color="secondary">
        Diagram failed to render. Check the mermaid source.
      </Text>
    );
  }

  return (
    <VStack gap={2}>
      {status === "loading" ? (
        <Text color="secondary">Rendering diagram…</Text>
      ) : null}
      <VStack
        ref={hostRef}
        as="figure"
        className="md-mermaid"
        aria-label="Diagram"
      />
    </VStack>
  );
}
