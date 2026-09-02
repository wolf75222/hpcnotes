const FENCE = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;

function rewriteDisplayMath(text: string) {
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr: string) => {
      return `\n\n\`\`\`math\n${expr.trim()}\n\`\`\`\n\n`;
    })
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, expr: string) => {
      return `\n\n\`\`\`math\n${expr.trim()}\n\`\`\`\n\n`;
    });
}

/** Turn `$$…$$` and `\[…\]` into `math` fences so they survive the Markdown split. */
export function liftDisplayMath(source: string) {
  const parts: string[] = [];
  let last = 0;
  for (const match of source.matchAll(FENCE)) {
    const index = match.index ?? 0;
    parts.push(rewriteDisplayMath(source.slice(last, index)));
    parts.push(match[0]);
    last = index + match[0].length;
  }
  parts.push(rewriteDisplayMath(source.slice(last)));
  return parts.join("");
}
