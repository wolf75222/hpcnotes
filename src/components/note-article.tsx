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

function NoteContents({
  pages,
  activeSlug,
}: {
  pages: NoteIndex[];
  activeSlug?: string;
}) {
  if (pages.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Contents">
      <VStack gap={5}>
        {pages.map((page, index) => (
          <LeaderRow
            key={page.slug}
            href={page.slug === activeSlug ? undefined : `/notes/${page.slug}`}
            label={page.title}
            meta={String(index + 1)}
          />
        ))}
      </VStack>
    </nav>
  );
}

export function NoteArticle({
  note,
  related,
  parent,
  pages,
  previous,
  next,
  readingLabel,
}: {
  note: Note;
  related: NoteIndex[];
  parent: NoteIndex | null;
  pages: NoteIndex[];
  previous: NoteIndex | null;
  next: NoteIndex | null;
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
        </HStack>
        <Heading level={1}>{note.title}</Heading>
      </VStack>
      {isCover ? null : <NoteContents pages={pages} activeSlug={note.slug} />}
      <MarkdownDoc>{note.body}</MarkdownDoc>
      {isCover ? <NoteContents pages={pages} /> : null}
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
              <LeaderRow href={`/notes/${next.slug}`} label={next.title} meta="Next" />
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
