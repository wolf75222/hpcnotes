import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { LayoutFooter } from "@astryxdesign/core/Layout";

export function SiteFooter() {
  return (
    <LayoutFooter hasDivider padding={4}>
      <VStack gap={2}>
        <HStack gap={4} wrap="wrap">
          <Link href="/" isStandalone>
            Posts
          </Link>
          <Link
            href="https://hpc-wiki.info/hpc/HPC_Wiki"
            isExternalLink
            isStandalone
          >
            Classic HPC Wiki
          </Link>
        </HStack>
        <Text color="secondary">
          HPC Wiki is a small blog of site-independent notes on high-performance
          computing. Advertising, when connected, helps keep the posts free.
        </Text>
      </VStack>
    </LayoutFooter>
  );
}
