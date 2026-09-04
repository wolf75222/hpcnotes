import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing, and personal thoughts around HPC.",
};

export default function HomePage() {
  return (
    <VStack gap={10}>
      <Text type="supporting" color="primary">
        Short notes on high-performance computing, and personal thoughts around
        HPC.
      </Text>
      <NoteList notes={getNotes()} showSummary />
    </VStack>
  );
}
