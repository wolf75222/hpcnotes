"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note, NoteIndex } from "@/content/types";
import { formatDotDate } from "@/lib/dates";
import { MarkdownDoc } from "@/components/markdown-doc";
import { PaperHeadings } from "@/components/paper-sidebar";
import { HashTags } from "@/components/hash-tags";
import { NoteList } from "@/components/note-list";
import { LeaderRow } from "@/components/leader-row";
import { AdSlot } from "@/components/ad-slot";

export function NoteArticle({
  note,
  related,
  parent,
  childrenNotes,
  previous,
  next,
  readingLabel,
}: {
  note: Note;
  related: NoteIndex[];
  parent: NoteIndex | null;
  childrenNotes: NoteIndex[];
  previous: NoteIndex | null;
  next: NoteIndex | null;
  readingLabel: string;
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
        <Text type="supporting" hasTabularNumbers color="disabled">
          {formatDotDate(note.date)} · {readingLabel}
        </Text>
        <Heading level={1}>{note.title}</Heading>
      </VStack>
      <PaperHeadings markdown={note.body} />
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {childrenNotes.length > 0 ? (
        <NoteList notes={childrenNotes} showDate={false} />
      ) : null}
      {previous != null || next != null ? (
        <VStack gap={5}>
          {previous != null ? (
            <LeaderRow
              href={`/notes/${previous.slug}`}
              label={previous.title}
              ariaLabel={`Previous: ${previous.title}`}
            />
          ) : null}
          {next != null ? (
            <LeaderRow
              href={`/notes/${next.slug}`}
              label={next.title}
              ariaLabel={`Next: ${next.title}`}
            />
          ) : null}
        </VStack>
      ) : null}
      <AdSlot placement="article" />
      <VStack gap={6}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? <NoteList notes={related} /> : null}
      </VStack>
    </VStack>
  );
}
