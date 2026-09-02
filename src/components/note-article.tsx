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

export function NoteArticle({
  note,
  related,
}: {
  note: Note;
  related: Note[];
}) {
  return (
    <VStack gap={6}>
      <Section padding={0}>
        <VStack gap={2}>
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
