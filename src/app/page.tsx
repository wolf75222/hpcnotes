import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";
import { buildThoughtForest, splitHomeLists } from "@/content/thoughts";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing, and personal thoughts around HPC.",
};

export default function HomePage() {
  const { notes, thoughts } = splitHomeLists(buildThoughtForest(getNotes()));

  return (
    <VStack gap={0}>
      <VStack gap={0} className="home-intro">
        <Text type="supporting" color="primary">
          Short notes on high-performance computing, and personal thoughts around
          HPC.
        </Text>
      </VStack>
      <VStack gap={10}>
        {notes.length > 0 ? (
          <VStack gap={5}>
            <Text type="supporting" color="secondary">
              Notes
            </Text>
            <NoteList notes={notes} showSummary />
          </VStack>
        ) : null}
        {thoughts.length > 0 ? (
          <VStack gap={5}>
            <Text type="supporting" color="secondary">
              Thoughts
            </Text>
            <NoteList notes={thoughts} showSummary />
          </VStack>
        ) : null}
        {notes.length === 0 && thoughts.length === 0 ? (
          <NoteList
            notes={[]}
            empty="Nothing published yet."
            actionLabel={null}
          />
        ) : null}
      </VStack>
    </VStack>
  );
}
