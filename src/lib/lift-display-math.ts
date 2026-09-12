const FENCE = /```[\s\S]*?```|~~~[\s\S]*?~~~|``[\s\S]*?``|`[^`\n]+`/g;

function rewriteDisplayMath(text: string) {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr: string) => {
      return `\n\n\`\`\`math\n${expr.trim()}\n\`\`\`\n\n`;
    })
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, expr: string) => {
      return `\n\n\`\`\`math\n${expr.trim()}\n\`\`\`\n\n`;
    });
}

function splitProtected(source: string) {
  const parts: string[] = [];
  let last = 0;
  for (const match of source.matchAll(FENCE)) {
    const index = match.index ?? 0;
    parts.push(rewriteDisplayMath(source.slice(last, index)));
    parts.push(match[0]);
    last = index + match[0].length;
  }
  const rest = source.slice(last);
  const opener = rest.search(/```|~~~/);
  if (opener >= 0) {
    parts.push(rewriteDisplayMath(rest.slice(0, opener)));
    parts.push(rest.slice(opener));
    return parts.join("");
  }
  parts.push(rewriteDisplayMath(rest));
  return parts.join("");
}

/** Turn `$$…$$` and `\[…\]` into `math` fences so they survive the Markdown split. */
export function liftDisplayMath(source: string) {
  return splitProtected(source);
}
