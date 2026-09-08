import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex, ThoughtNode } from "@/content/types";
import { notesByYear } from "@/content/query";
import { buildThoughtForest } from "@/content/thoughts";
import { formatDotDate } from "@/lib/dates";
import { LeaderRow } from "@/components/leader-row";
import { EmptyNotes } from "@/components/empty-notes";

function NoteRows({
  notes,
  showSummary,
  onNavigate,
  depth = 0,
}: {
  notes: NoteIndex[];
  showSummary: boolean;
  onNavigate?: () => void;
  depth?: number;
}) {
  return (
    <VStack gap={5}>
      {notes.map((note) => (
        <LeaderRow
          key={note.slug}
          href={`/notes/${note.slug}`}
          label={note.title}
          meta={formatDotDate(note.date)}
          depth={depth}
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

function ThoughtBlock({
  node,
  depth,
  showSummary,
  onNavigate,
}: {
  node: ThoughtNode;
  depth: number;
  showSummary: boolean;
  onNavigate?: () => void;
}) {
  return (
    <VStack gap={3} className="thought-block">
      <LeaderRow
        href={`/notes/${node.note.slug}`}
        label={node.note.title}
        meta={formatDotDate(node.note.date)}
        depth={depth}
        onNavigate={onNavigate}
        extra={
          showSummary && depth === 0 && node.note.summary ? (
            <Text type="supporting" color="secondary">{node.note.summary}</Text>
          ) : undefined
        }
      />
      {node.children.map((child) => (
        <ThoughtBlock
          key={child.note.slug}
          node={child}
          depth={depth + 1}
          showSummary={false}
          onNavigate={onNavigate}
        />
      ))}
    </VStack>
  );
}

export function NoteList({
  notes,
  grouped = false,
  tree = false,
  showSummary = false,
  empty = "No notes in this list yet.",
  onNavigate,
}: {
  notes: NoteIndex[];
  grouped?: boolean;
  tree?: boolean;
  showSummary?: boolean;
  empty?: string;
  onNavigate?: () => void;
}) {
  if (notes.length === 0) {
    return <EmptyNotes title="Nothing here" description={empty} />;
  }

  if (tree) {
    return (
      <VStack gap={8}>
        {buildThoughtForest(notes).map((node) => (
          <ThoughtBlock
            key={node.note.slug}
            node={node}
            depth={0}
            showSummary={showSummary}
            onNavigate={onNavigate}
          />
        ))}
      </VStack>
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
