import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import type { Note, NoteIndex, ThoughtRef } from "@/content/types";
import { formatDotDate, isIsoDate, noteYear } from "@/lib/dates";
import { MarkdownDoc } from "@/components/markdown-doc";
import { HashTags } from "@/components/hash-tags";
import { NoteList } from "@/components/note-list";
import { LeaderRow } from "@/components/leader-row";
import { NoteContents } from "@/components/note-contents";
import { NoteTurn } from "@/components/note-turn";
import { AdSlot } from "@/components/ad-slot";

export function NoteArticle({
  note,
  related,
  ancestors,
  contents,
  previous,
  next,
  readingLabel,
}: {
  note: Note;
  related: NoteIndex[];
  ancestors: NoteIndex[];
  contents: ThoughtRef[];
  previous: NoteIndex | null;
  next: NoteIndex | null;
  readingLabel: string;
}) {
  const isCover = ancestors.length === 0 && contents.length > 0;

  return (
    <VStack gap={10} as="article">
      <VStack gap={1}>
        {ancestors.length > 0 ? (
          <HStack
            gap={1}
            align="center"
            wrap="wrap"
            as="nav"
            aria-label="Breadcrumb"
          >
            {ancestors.flatMap((item, index) => [
              index > 0 ? (
                <Text key={`sep-${item.slug}`} type="supporting" color="secondary">
                  ·
                </Text>
              ) : null,
              <Link
                key={item.slug}
                href={`/notes/${item.slug}`}
                color="secondary"
                type="supporting"
                isStandalone
              >
                {item.title}
              </Link>,
            ])}
          </HStack>
        ) : null}
        <HStack gap={3} align="center" justify="between" wrap="wrap">
          <HStack gap={2} align="center" wrap="wrap">
            {isIsoDate(note.date) ? (
              <Link
                href={`/years/${noteYear(note.date)}`}
                color="secondary"
                type="supporting"
                label={`Notes from ${noteYear(note.date)}`}
              >
                <time dateTime={note.date}>{formatDotDate(note.date)}</time>
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
          <NoteTurn
            coverHref={
              ancestors[0] != null ? `/notes/${ancestors[0].slug}` : undefined
            }
            previousHref={
              previous != null ? `/notes/${previous.slug}` : undefined
            }
            nextHref={next != null ? `/notes/${next.slug}` : undefined}
          />
        </HStack>
        <Heading level={1} color="primary" className="article-heading">
          {note.title}
        </Heading>
      </VStack>
      {isCover ? null : (
        <NoteContents key={note.slug} pages={contents} activeSlug={note.slug} />
      )}
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {isCover ? <NoteContents key={note.slug} pages={contents} /> : null}
      {previous != null || next != null ? (
        <nav aria-label="Previous and next">
          <VStack gap={5}>
            {previous != null ? (
              <LeaderRow
                href={`/notes/${previous.slug}`}
                label={previous.title}
                meta="Previous"
              />
            ) : null}
            {next != null ? (
              <LeaderRow
                href={`/notes/${next.slug}`}
                label={next.title}
                meta="Next"
              />
            ) : null}
          </VStack>
        </nav>
      ) : null}
      <AdSlot placement="article" />
      <VStack gap={6}>
        <HashTags tags={note.tags} />
        {related.length > 0 ? <NoteList notes={related} /> : null}
      </VStack>
    </VStack>
  );
}
