import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";
import { buildThoughtForest } from "@/content/thoughts";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing, and personal thoughts around HPC.",
};

export default function HomePage() {
  const roots = buildThoughtForest(getNotes()).map((node) => node.note);

  return (
    <VStack gap={0}>
      <div className="home-intro">
        <Text type="supporting" color="primary">
          Short notes on high-performance computing, and personal thoughts
          around HPC.
        </Text>
      </div>
      <NoteList notes={roots} showSummary />
    </VStack>
  );
}
