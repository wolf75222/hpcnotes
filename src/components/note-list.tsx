import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note } from "@/content/types";
import { notesByYear } from "@/content/query";
import { formatDotDate } from "@/lib/dates";
import { LeaderRow } from "@/components/leader-row";
import { EmptyNotes } from "@/components/empty-notes";

function NoteRows({
  notes,
  showSummary,
}: {
  notes: Note[];
  showSummary: boolean;
}) {
  return (
    <VStack gap={5}>
      {notes.map((note) => (
        <LeaderRow
          key={note.slug}
          href={`/notes/${note.slug}`}
          label={note.title}
          meta={formatDotDate(note.date)}
          extra={
            showSummary && note.summary ? (
              <Text color="secondary">{note.summary}</Text>
            ) : undefined
          }
        />
      ))}
    </VStack>
  );
}

export function NoteList({
  notes,
  grouped = false,
  showSummary = false,
  empty = "No notes in this list yet.",
}: {
  notes: Note[];
  grouped?: boolean;
  showSummary?: boolean;
  empty?: string;
}) {
  if (notes.length === 0) {
    return <EmptyNotes title="Nothing here" description={empty} />;
  }

  if (grouped) {
    return (
      <VStack gap={10}>
        {notesByYear(notes).map((group) => (
          <VStack key={group.year} gap={3}>
            <Text type="supporting">{group.year}</Text>
            <NoteRows notes={group.notes} showSummary={showSummary} />
          </VStack>
        ))}
      </VStack>
    );
  }

  return <NoteRows notes={notes} showSummary={showSummary} />;
}
