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
