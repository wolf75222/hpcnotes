"use client";

import { Markdown } from "@astryxdesign/core/Markdown";
import { Link } from "@astryxdesign/core/Link";

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

export function MarkdownDoc({ children }: { children: string }) {
  return (
    <Markdown
      headingLevelStart={1}
      contentWidth={680}
      autolink="gfm"
      components={{ link: MarkdownLink }}
    >
      {children}
    </Markdown>
  );
}
