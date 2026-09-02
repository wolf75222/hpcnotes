import type { Metadata } from "next";
import { Section } from "@astryxdesign/core/Section";
import { VStack } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Text";
import { Text } from "@astryxdesign/core/Text";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/content/load-notes";

export const metadata: Metadata = {
  title: { absolute: "hpcnotes.eu" },
  description:
    "Short notes on high-performance computing: Slurm, MPI, GPUs, I/O, and the habits that transfer between clusters.",
};

export default function HomePage() {
  const notes = getNotes();

  return (
    <VStack gap={8}>
      <Section padding={0}>
        <VStack gap={2}>
          <Heading level={1}>Short notes on high-performance computing</Heading>
          <Text color="secondary">
            Site-independent, dated, and meant to sit beside a centre handbook —
            not replace it.
          </Text>
        </VStack>
      </Section>
      <NoteList notes={notes} grouped />
    </VStack>
  );
}
