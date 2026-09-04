import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { NoteList } from "@/components/note-list";
import { HomeAtmosphere } from "@/components/home-atmosphere";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing: Slurm, MPI, GPUs, I/O, and the habits that transfer between clusters.",
};

export default function HomePage() {
  return (
    <>
      <HomeAtmosphere />
      <VStack gap={8}>
        <Text>
          Short notes on high-performance computing. Hostnames, partitions, and
          module names stay in the centre handbook. These thoughts cover the
          habits that transfer: batch, MPI, GPUs, I/O, and the etiquette of a
          shared machine.
        </Text>
        <NoteList notes={getNotes()} showSummary />
      </VStack>
    </>
  );
}
