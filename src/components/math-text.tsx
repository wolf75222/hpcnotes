"use client";

import { useEffect, useRef } from "react";
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
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current == null) {
      return;
    }
    katex.render(expr.trim(), ref.current, {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  }, [display, expr]);

  return (
    <Text
      ref={ref}
      as={display ? "div" : "span"}
      display={display ? "block" : "inline"}
      className={display ? "md-math-display" : "md-math-inline"}
    >
      {expr}
    </Text>
  );
}
