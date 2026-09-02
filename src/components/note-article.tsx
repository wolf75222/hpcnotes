"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Section } from "@astryxdesign/core/Section";
import { Divider } from "@astryxdesign/core/Divider";
import type { Note } from "@/content/types";
import { formatDotDate } from "@/lib/dates";
import { MarkdownDoc } from "@/components/markdown-doc";
import { HashTags } from "@/components/hash-tags";
import { NoteList } from "@/components/note-list";
import { AdSlot } from "@/components/ad-slot";
import Script from "next/script";

export function NoteArticle({
  note,
  related,
}: {
  note: Note;
  related: Note[];
}) {
  return (
    <VStack gap={6}>
      {note.body.includes("```mermaid") ? (
        <Script
          id="hpc-mermaid"
          src="/vendor/mermaid.min.js"
          strategy="afterInteractive"
        />
      ) : null}
      <Section padding={0}>
        <VStack gap={3}>
          <Text type="supporting" color="secondary" hasTabularNumbers>
            {formatDotDate(note.date)}
          </Text>
          <Heading level={1}>{note.title}</Heading>
        </VStack>
      </Section>
      <MarkdownDoc>{note.body}</MarkdownDoc>
      <AdSlot placement="article" />
      <VStack gap={5}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? (
          <VStack gap={3}>
            <Divider variant="subtle" />
            <NoteList notes={related} />
          </VStack>
        ) : null}
      </VStack>
    </VStack>
  );
}
