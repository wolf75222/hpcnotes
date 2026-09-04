import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import { notesByYear } from "@/content/query";
import { formatDotDate } from "@/lib/dates";
import { LeaderRow } from "@/components/leader-row";
import { EmptyNotes } from "@/components/empty-notes";

function NoteRows({
  notes,
  showSummary,
  onNavigate,
}: {
  notes: NoteIndex[];
  showSummary: boolean;
  onNavigate?: () => void;
}) {
  return (
    <VStack gap={5}>
      {notes.map((note) => (
        <LeaderRow
          key={note.slug}
          href={`/notes/${note.slug}`}
          label={note.title}
          meta={formatDotDate(note.date)}
          onNavigate={onNavigate}
          extra={
            showSummary && note.summary ? (
              <Text type="supporting" color="secondary">{note.summary}</Text>
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
  onNavigate,
}: {
  notes: NoteIndex[];
  grouped?: boolean;
  showSummary?: boolean;
  empty?: string;
  onNavigate?: () => void;
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
            <NoteRows
              notes={group.notes}
              showSummary={showSummary}
              onNavigate={onNavigate}
            />
          </VStack>
        ))}
      </VStack>
    );
  }

  return (
    <NoteRows
      notes={notes}
      showSummary={showSummary}
      onNavigate={onNavigate}
    />
  );
}
