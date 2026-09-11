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
  pages,
  next,
  pageOf,
  readingLabel,
}: {
  note: Note;
  related: NoteIndex[];
  parent: NoteIndex | null;
  pages: NoteIndex[];
  next: NoteIndex | null;
  pageOf: string | null;
  readingLabel: string;
}) {
  const isCover = parent == null && pages.length > 0;

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
          {pageOf != null ? (
            <Text type="supporting" color="secondary" hasTabularNumbers>
              · {pageOf}
            </Text>
          ) : null}
        </HStack>
        <Heading level={1}>{note.title}</Heading>
      </VStack>
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {isCover ? <NoteList notes={pages} showSummary showDate={false} /> : null}
      {next != null ? (
        <LeaderRow href={`/notes/${next.slug}`} label={next.title} meta="Next" />
      ) : null}
      <AdSlot placement="article" />
      <VStack gap={6}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? <NoteList notes={related} /> : null}
      </VStack>
    </VStack>
  );
}
