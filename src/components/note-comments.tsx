"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { DiscloseMark, DiscloseOpenMark } from "@/components/paper-icons";
import { GISCUS } from "@/lib/comments";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

/**
 * Comments stay folded behind one quiet row, like the contents list.
 * Nothing loads from giscus.app or GitHub until the reader opens them.
 */
export function NoteComments({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [theme] = useState(() =>
    typeof window === "undefined"
      ? "light"
      : `${window.location.origin}/giscus-theme.css`,
  );

  return (
    <VStack gap={3} as="section" aria-label="Comments" id="comments">
      <Link
        className="note-contents-toggle"
        color="secondary"
        type="supporting"
        aria-expanded={open}
        aria-controls="note-comments"
        onClick={() => setOpen((value) => !value)}
      >
        <HStack as="span" gap={1} align="center">
          <Icon
            icon={open ? DiscloseOpenMark : DiscloseMark}
            size="xsm"
            color="inherit"
          />
          <span>Comments</span>
        </HStack>
      </Link>
      {open ? (
        <VStack gap={3} id="note-comments" className="note-comments">
          <Text type="supporting" color="secondary">
            Stored in{" "}
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
          <Giscus
            repo={GISCUS.repo}
            repoId={GISCUS.repoId}
            category={GISCUS.category}
            categoryId={GISCUS.categoryId}
            mapping="specific"
            term={slug}
            strict="1"
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="bottom"
            theme={theme}
            lang="en"
            loading="lazy"
          />
        </VStack>
      ) : null}
    </VStack>
  );
}
