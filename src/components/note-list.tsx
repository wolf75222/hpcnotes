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
  showDate,
  onNavigate,
}: {
  notes: NoteIndex[];
  showSummary: boolean;
  showDate: boolean;
  onNavigate?: () => void;
}) {
  return (
    <VStack gap={5}>
      {notes.map((note) => (
        <LeaderRow
          key={note.slug}
          href={`/notes/${note.slug}`}
          label={note.title}
          meta={showDate ? formatDotDate(note.date) : undefined}
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
  showDate = true,
  empty = "No notes in this list yet.",
  actionLabel,
  onNavigate,
}: {
  notes: NoteIndex[];
  grouped?: boolean;
  showSummary?: boolean;
  showDate?: boolean;
  empty?: string;
  actionLabel?: string | null;
  onNavigate?: () => void;
}) {
  if (notes.length === 0) {
    return (
      <EmptyNotes
        title="Nothing here"
        description={empty}
        actionLabel={actionLabel}
      />
    );
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
              showDate={showDate}
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
      showDate={showDate}
      onNavigate={onNavigate}
    />
  );
}
