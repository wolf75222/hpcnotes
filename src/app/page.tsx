import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing: Slurm, MPI, GPUs, I/O, and the habits that transfer between clusters.",
};

export default function HomePage() {
  return (
    <VStack gap={10}>
      <VStack gap={5}>
        <Text>
          Short notes on high-performance computing. Hostnames, partitions, and
          module names stay in the centre handbook.
        </Text>
        <Text>
          These thoughts cover the habits that transfer: batch, MPI, GPUs, I/O,
          and the etiquette of a shared machine.
        </Text>
      </VStack>
      <NoteList notes={getNotes()} showSummary />
    </VStack>
  );
}
