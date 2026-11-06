"use client";

import dynamic from "next/dynamic";
import { Text } from "@astryxdesign/core/Text";

// Syntax highlighting and KaTeX only load on pages that use them.
const CodeBlock = dynamic(() =>
  import("@astryxdesign/core/CodeBlock").then((mod) => mod.CodeBlock),
);
const MathText = dynamic(() =>
  import("@/components/math-text").then((mod) => mod.MathText),
);

const MATH_LANGS = new Set(["math", "latex", "katex", "tex"]);

const MermaidBlock = dynamic(
  () => import("@/components/mermaid-block").then((mod) => mod.MermaidBlock),
  {
    loading: () => (
      <Text type="supporting" color="secondary">
        …
      </Text>
    ),
  },
);

export function MarkdownCode({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const lang = (language ?? "").toLowerCase();

  if (lang === "mermaid") {
    return <MermaidBlock chart={code} />;
  }

  if (MATH_LANGS.has(lang)) {
    return <MathText expr={code} display />;
  }

  return (
    <div className="md-code">
      <CodeBlock
        code={code}
        language={language || "plaintext"}
        hasCopyButton
        hasLanguageLabel={false}
        width="100%"
        container="section"
      />
    </div>
  );
}
