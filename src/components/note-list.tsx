import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Section } from "@astryxdesign/core/Section";
import type { Note } from "@/content/types";
import { notesByYear } from "@/content/query";
import { formatDotDate } from "@/lib/dates";
import { LeaderRow } from "@/components/leader-row";
import { EmptyNotes } from "@/components/empty-notes";

function NoteRows({ notes }: { notes: Note[] }) {
  return (
    <VStack gap={4}>
      {notes.map((note) => (
        <LeaderRow
          key={note.slug}
          href={`/notes/${note.slug}`}
          label={note.title}
          meta={formatDotDate(note.date)}
        />
      ))}
    </VStack>
  );
}

export function NoteList({
  notes,
  grouped = false,
  empty = "No notes in this list yet.",
}: {
  notes: Note[];
  grouped?: boolean;
  empty?: string;
}) {
  if (notes.length === 0) {
    return <EmptyNotes title="Nothing here" description={empty} />;
  }

  if (grouped) {
    return (
      <VStack gap={8}>
        {notesByYear(notes).map((group) => (
          <Section key={group.year} padding={0}>
            <VStack gap={3}>
              <Text type="supporting" color="secondary">
                {group.year}
              </Text>
              <NoteRows notes={group.notes} />
            </VStack>
          </Section>
        ))}
      </VStack>
    );
  }

  return <NoteRows notes={notes} />;
}
