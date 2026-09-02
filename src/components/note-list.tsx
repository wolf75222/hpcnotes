import { Text } from "@astryxdesign/core/Text";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import type { Note } from "@/content/types";
import { notesByYear } from "@/content/catalog";
import { formatDotDate } from "@/lib/dates";
import { LeaderRow } from "@/components/leader-row";
import { TagLinks } from "@/components/tag-links";
import { EmptyNotes } from "@/components/empty-notes";

function NoteRows({
  notes,
  numbered,
}: {
  notes: Note[];
  numbered?: boolean;
}) {
  return (
    <VStack gap={4}>
      {notes.map((note, index) => {
        const row = (
          <LeaderRow
            href={`/notes/${note.slug}`}
            label={note.title}
            meta={formatDotDate(note.date)}
            extra={<TagLinks tags={note.tags} />}
          />
        );

        if (!numbered) {
          return <VStack key={note.slug}>{row}</VStack>;
        }

        return (
          <HStack key={note.slug} gap={3} align="start">
            <Text type="supporting" hasTabularNumbers textWrap="nowrap">
              {String(index + 1).padStart(2, "0")}
            </Text>
            <StackItem size="fill">{row}</StackItem>
          </HStack>
        );
      })}
    </VStack>
  );
}

export function NoteList({
  notes,
  grouped = false,
  numbered = false,
  empty = "No notes in this list yet.",
}: {
  notes: Note[];
  grouped?: boolean;
  numbered?: boolean;
  empty?: string;
}) {
  if (notes.length === 0) {
    return (
      <EmptyNotes
        title="Nothing here"
        description={empty}
      />
    );
  }

  if (grouped) {
    return (
      <VStack gap={8}>
        {notesByYear(notes).map((group) => (
          <Section key={group.year} padding={0}>
            <VStack gap={3}>
              <Link href={`/years/${group.year}`} color="secondary" isStandalone>
                {group.year}
              </Link>
              <NoteRows notes={group.notes} numbered={numbered} />
            </VStack>
          </Section>
        ))}
      </VStack>
    );
  }

  return <NoteRows notes={notes} numbered={numbered} />;
}
