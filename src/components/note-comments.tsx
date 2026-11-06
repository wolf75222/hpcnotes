"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { GISCUS } from "@/lib/comments";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

/**
 * Comments load only when the reader scrolls near them: no third-party
 * request (and no GitHub iframe) for people who never reach the end.
 */
export function NoteComments({ slug }: { slug: string }) {
  const anchor = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = anchor.current;
    if (node == null || visible) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <VStack gap={3} as="section" aria-label="Comments" id="comments" ref={anchor}>
      <Text type="supporting" color="secondary">
        <span className="home-group">Comments</span>
      </Text>
      <Text type="supporting" color="secondary">
        Comments live in{" "}
        <Link
          href={`https://github.com/${GISCUS.repo}/discussions`}
          target="_blank"
          rel="noopener noreferrer"
          type="supporting"
          color="secondary"
          hasUnderline
        >
          GitHub Discussions
        </Link>
        . Sign in with GitHub to post.
      </Text>
      <VStack gap={0} className="note-comments">
        {visible ? (
          <Giscus
            repo={GISCUS.repo}
            repoId={GISCUS.repoId}
            category={GISCUS.category}
            categoryId={GISCUS.categoryId}
            mapping="specific"
            term={slug}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
            loading="lazy"
          />
        ) : null}
      </VStack>
    </VStack>
  );
}
