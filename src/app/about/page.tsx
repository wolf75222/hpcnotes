import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "hpcnotes.eu — short notes on high-performance computing.",
};

export default function AboutPage() {
  return (
    <VStack gap={6}>
      <PageHeading
        title="About"
        trail={[
          { href: "/", label: "notes" },
          { label: "about", current: true },
        ]}
      />
      <Text>
        hpcnotes.eu is a small set of short notes on high-performance computing.
        Hostnames, partitions, and module names stay in the centre handbook.
        These notes cover the habits that transfer: batch, MPI, GPUs, I/O, and
        the etiquette of a shared machine.
      </Text>
      <Text>
        <Link href="/tags" hasUnderline>
          Tags
        </Link>{" "}
        and{" "}
        <Link href="/years" hasUnderline>
          years
        </Link>{" "}
        are indexes.{" "}
        <Link href="/playlists" hasUnderline>
          Playlists
        </Link>{" "}
        are ordered reading lists.{" "}
        <Link href="/search" hasUnderline>
          Search
        </Link>{" "}
        looks through titles, tags, and bodies. A note can carry code,
        diagrams, maths, images, and gifs.
      </Text>
      <Text color="secondary">
        Nothing here is a substitute for the machine you are about to log into.
      </Text>
    </VStack>
  );
}
