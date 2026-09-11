"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import type { Note, NoteIndex } from "@/content/types";
import { formatDotDate, isIsoDate, noteYear } from "@/lib/dates";
import { MarkdownDoc } from "@/components/markdown-doc";
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
            className="note-parent-inline"
          >
            {parent.title}
          </Link>
        ) : null}
        <HStack gap={2} align="center" wrap="wrap">
          {isIsoDate(note.date) ? (
            <Link
              href={`/years/${noteYear(note.date)}`}
              color="secondary"
              type="supporting"
              label={`Notes from ${noteYear(note.date)}`}
            >
              {formatDotDate(note.date)}
            </Link>
          ) : (
            <Text type="supporting" color="secondary" hasTabularNumbers>
              {formatDotDate(note.date)}
            </Text>
          )}
          <Text type="supporting" color="secondary">
            · {readingLabel}
          </Text>
        </HStack>
        <Heading level={1}>{note.title}</Heading>
      </VStack>
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {childrenNotes.length > 0 ? (
        <VStack gap={5} className="note-pages-inline">
          <NoteList notes={childrenNotes} showDate={false} />
        </VStack>
      ) : null}
      {previous != null || next != null ? (
        <VStack gap={6} className="note-pager-inline">
          {previous != null ? (
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Previous
              </Text>
              <LeaderRow
                href={`/notes/${previous.slug}`}
                label={previous.title}
                ariaLabel={`Previous: ${previous.title}`}
              />
            </VStack>
          ) : null}
          {next != null ? (
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                Next
              </Text>
              <LeaderRow
                href={`/notes/${next.slug}`}
                label={next.title}
                ariaLabel={`Next: ${next.title}`}
              />
            </VStack>
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
