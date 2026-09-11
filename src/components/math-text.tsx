"use client";

import katex from "katex";
import { Text } from "@astryxdesign/core/Text";
import "katex/dist/katex.min.css";

const MAX_EXPR = 2048;

export function MathText({
  expr,
  display = false,
}: {
  expr: string;
  display?: boolean;
}) {
  const trimmed = expr.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (trimmed.length > MAX_EXPR) {
    return (
      <Text type="supporting" color="secondary">
        Expression is too long to render.
      </Text>
    );
  }

  const html = katex.renderToString(trimmed, {
    displayMode: display,
    throwOnError: false,
    trust: false,
    output: "html",
  });

  const Tag = display ? "div" : "span";

  return (
    <Text
      as={display ? "div" : "span"}
      display={display ? "block" : "inline"}
      className={display ? "md-math-display" : "md-math-inline"}
    >
      <Tag
        // KaTeX HTML; Astryx Text omits dangerouslySetInnerHTML from its props.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Text>
  );
}
