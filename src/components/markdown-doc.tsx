"use client";

import { Markdown } from "@astryxdesign/core/Markdown";
import { Link } from "@astryxdesign/core/Link";
import { Code } from "@astryxdesign/core/CodeBlock";
import { Divider } from "@astryxdesign/core/Divider";
import { MathText } from "@/components/math-text";
import { MarkdownCode } from "@/components/markdown-code";
import { MarkdownImage } from "@/components/markdown-image";
import { liftDisplayMath } from "@/lib/lift-display-math";
import type { MarkdownInlinePlugin } from "@astryxdesign/core/Markdown";

function MarkdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  return (
    <Link href={href} isExternalLink={isExternal} hasUnderline>
      {children}
    </Link>
  );
}

const mathPlugins: MarkdownInlinePlugin[] = [
  {
    pattern: /\\\(([\s\S]+?)\\\)/g,
    render: (match, key) => <MathText key={key} expr={match[1] ?? ""} />,
  },
  {
    pattern: /(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g,
    render: (match, key) => <MathText key={key} expr={match[1] ?? ""} />,
  },
];

export function MarkdownDoc({ children }: { children: string }) {
  return (
    <Markdown
      headingLevelStart={1}
      contentWidth={640}
      autolink="gfm"
      inlinePlugins={mathPlugins}
      components={{
        link: MarkdownLink,
        code: MarkdownCode,
        inlineCode: ({ children: code }) => <Code>{code}</Code>,
        image: MarkdownImage,
        hr: () => <Divider variant="subtle" />,
      }}
    >
      {liftDisplayMath(children)}
    </Markdown>
  );
}
