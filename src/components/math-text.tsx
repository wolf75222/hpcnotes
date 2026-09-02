"use client";

import katex from "katex";
import { Text } from "@astryxdesign/core/Text";
import "katex/dist/katex.min.css";

export function MathText({
  expr,
  display = false,
}: {
  expr: string;
  display?: boolean;
}) {
  const html = katex.renderToString(expr.trim(), {
    displayMode: display,
    throwOnError: false,
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
