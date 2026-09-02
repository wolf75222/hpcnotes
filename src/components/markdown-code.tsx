"use client";

import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { MermaidBlock } from "@/components/mermaid-block";
import { MathText } from "@/components/math-text";

const MATH_LANGS = new Set(["math", "latex", "katex", "tex"]);

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

  const lineCount = code.split("\n").length;

  return (
    <CodeBlock
      code={code}
      language={language || "plaintext"}
      hasCopyButton
      hasLanguageLabel
      hasLineNumbers={lineCount >= 5}
      isCollapsible={lineCount > 12}
      width="100%"
      container="section"
    />
  );
}
