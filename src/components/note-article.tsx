"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note, NoteIndex, ThoughtRef } from "@/content/types";
import { formatDotDate } from "@/lib/dates";
import { formatReadingTime } from "@/lib/reading-time";
import { MarkdownDoc } from "@/components/markdown-doc";
import { PaperDock } from "@/components/paper-dock";
import { HashTags } from "@/components/hash-tags";
import { NoteList } from "@/components/note-list";
import { AdSlot } from "@/components/ad-slot";

export function NoteArticle({
  note,
  related,
  parent,
  childrenNotes,
  thoughts,
}: {
  note: Note;
  related: NoteIndex[];
  parent: NoteIndex | null;
  childrenNotes: NoteIndex[];
  thoughts: ThoughtRef[];
}) {
  return (
    <VStack gap={10}>
      <VStack gap={1}>
        {parent != null ? (
          <Link
            href={`/notes/${parent.slug}`}
            color="secondary"
            type="supporting"
            isStandalone
          >
            {parent.title}
          </Link>
        ) : null}
        <Text type="supporting" hasTabularNumbers>
          {formatDotDate(note.date)} · {formatReadingTime(note.body)}
        </Text>
        <Heading level={1}>{note.title}</Heading>
      </VStack>
      <PaperDock
        markdown={note.body}
        thoughts={thoughts}
        activeSlug={note.slug}
      />
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {childrenNotes.length > 0 ? (
        <NoteList notes={childrenNotes} showSummary />
      ) : null}
      <AdSlot placement="article" />
      <VStack gap={6}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? <NoteList notes={related} /> : null}
      </VStack>
    </VStack>
  );
}
