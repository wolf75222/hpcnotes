import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";
import { NoteList } from "@/components/note-list";
import { getThoughtForest } from "@/content/load-notes";
import { splitHomeLists } from "@/content/thoughts";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing, and personal thoughts around HPC.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const { notes, thoughts } = splitHomeLists(getThoughtForest());

  return (
    <VStack gap={0}>
      <VisuallyHidden>
        <Heading level={1}>hpcnotes</Heading>
      </VisuallyHidden>
      <VStack gap={0} className="home-intro">
        <Text type="supporting" color="secondary">
          Short notes on high-performance computing, and personal thoughts around
          HPC.
        </Text>
      </VStack>
      <VStack gap={10}>
        {notes.length > 0 ? (
          <VStack gap={5}>
            <Text type="supporting" color="secondary" className="home-group">
              Notes
            </Text>
            <NoteList notes={notes} showSummary />
          </VStack>
        ) : null}
        {thoughts.length > 0 ? (
          <VStack gap={5}>
            <Text type="supporting" color="secondary" className="home-group">
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
