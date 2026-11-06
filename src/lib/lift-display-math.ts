import { mapOutsideCode } from "./markdown-text";

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
  return mapOutsideCode(source, rewriteDisplayMath);
}
