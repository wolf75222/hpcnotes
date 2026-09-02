import type { Metadata } from "next";
import { Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";
import { WritingList } from "@/components/writing-list";
import { getPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "HPC Wiki",
  description:
    "A small blog of site-independent notes on high-performance computing: Slurm, MPI, GPUs, and the habits that transfer between clusters.",
};

export default function HomePage() {
  const posts = getPosts();

  return (
    <VStack gap={8}>
      <Text>
        Short notes on high-performance computing. Local docs still own
        hostnames. These posts own the habits that transfer — the same brief as
        the{" "}
        <Link
          href="https://hpc-wiki.info/hpc/HPC_Wiki"
          hasUnderline
          isExternalLink
        >
          classic HPC Wiki
        </Link>
        , written as dated notes instead of a MediaWiki.
      </Text>
      <WritingList posts={posts} />
    </VStack>
  );
}
