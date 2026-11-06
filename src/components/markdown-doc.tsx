"use client";

import { Markdown } from "@astryxdesign/core/Markdown";
import { Link } from "@astryxdesign/core/Link";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import dynamic from "next/dynamic";
import { Code } from "@astryxdesign/core/Code";
import { MarkdownCode } from "@/components/markdown-code";
import { MarkdownImage } from "@/components/markdown-image";
import { liftDisplayMath } from "@/lib/lift-display-math";
import { markdownLinkProps } from "@/lib/markdown-href";
import type { MarkdownInlinePlugin } from "@astryxdesign/core/Markdown";

function MarkdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const props = markdownLinkProps(href);
  if (props == null) {
    return <Text>{children}</Text>;
  }
  return (
    <Link
      href={props.href}
      target={props.target}
      rel={props.rel}
      hasUnderline
      className="md-link"
    >
      {children}
    </Link>
  );
}

// KaTeX is ~100 kB of JS: load it only on pages that contain maths.
// Still server-rendered, so the formulas are in the HTML for crawlers.
const MathText = dynamic(() =>
  import("@/components/math-text").then((mod) => mod.MathText),
);

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
    <VStack gap={0} className="md-doc">
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
          heading: ({ children: heading, id, level }) => (
            <Heading
              level={level}
              id={id}
              color="primary"
              className="article-heading"
            >
              {heading}
              {id != null ? (
                <Link
                  href={`#${id}`}
                  className="heading-anchor"
                  color="secondary"
                  hasUnderline={false}
                  label="Link to this section"
                >
                  #
                </Link>
              ) : null}
            </Heading>
          ),
          hr: () => null,
        }}
      >
        {liftDisplayMath(children)}
      </Markdown>
    </VStack>
  );
}
