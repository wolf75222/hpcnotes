import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

export const metadata: Metadata = {
  title: "About",
  description: "hpcnotes.eu — short notes on high-performance computing.",
};

export default function AboutPage() {
  return (
    <VStack gap={5}>
      <Text>
        Short notes on high-performance computing. Hostnames, partitions, and
        module names stay in the centre handbook. These notes cover the habits
        that transfer: batch, MPI, GPUs, I/O, and the etiquette of a shared
        machine.
      </Text>
      <Text color="secondary">
        Nothing here is a substitute for the machine you are about to log into.
      </Text>
    </VStack>
  );
}
