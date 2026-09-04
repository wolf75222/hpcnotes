"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note } from "@/content/types";
import { formatDotDate } from "@/lib/dates";
import { formatReadingTime } from "@/lib/reading-time";
import { MarkdownDoc } from "@/components/markdown-doc";
import { ArticleToc } from "@/components/article-toc";
import { HashTags } from "@/components/hash-tags";
import { NoteList } from "@/components/note-list";
import { AdSlot } from "@/components/ad-slot";

export function NoteArticle({
  note,
  related,
}: {
  note: Note;
  related: Note[];
}) {
  return (
    <VStack gap={10}>
      <VStack gap={6}>
        <VStack gap={1}>
          <Text type="supporting" hasTabularNumbers>
            {formatDotDate(note.date)} · {formatReadingTime(note.body)}
          </Text>
          <Heading level={1}>{note.title}</Heading>
        </VStack>
        <ArticleToc markdown={note.body} />
      </VStack>
      <MarkdownDoc>{note.body}</MarkdownDoc>
      <AdSlot placement="article" />
      <VStack gap={6}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? <NoteList notes={related} /> : null}
      </VStack>
    </VStack>
  );
}
