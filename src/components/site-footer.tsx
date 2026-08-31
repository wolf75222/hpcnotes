import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Divider } from "@astryxdesign/core/Divider";
import { LayoutFooter } from "@astryxdesign/core/Layout";

export function SiteFooter() {
  return (
    <LayoutFooter hasDivider padding={4}>
      <VStack gap={3}>
        <HStack gap={4} wrap="wrap">
          <Link href="/wiki" isStandalone>
            Wiki
          </Link>
          <Link href="/blog" isStandalone>
            Blog
          </Link>
          <Link href="/contribute" isStandalone>
            Contribute
          </Link>
          <Link href="/search" isStandalone>
            Search
          </Link>
          <Link href="https://hpc-wiki.info/hpc/HPC_Wiki" isExternalLink isStandalone>
            Classic HPC Wiki
          </Link>
        </HStack>
        <Divider />
        <Text color="secondary">
          HPC Wiki is a modern wiki and blog for site-independent high-performance
          computing. Advertising, when connected, helps keep the material free.
          Hostnames and partition names always come from your centre.
        </Text>
      </VStack>
    </LayoutFooter>
  );
}
