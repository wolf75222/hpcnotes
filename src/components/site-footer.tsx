import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";

export function SiteFooter() {
  return (
    <HStack justify="between" align="center" wrap="wrap" gap={4}>
      <Text type="supporting">HPC Wiki</Text>
      <HStack gap={4} wrap="wrap">
        <Link href="/" color="secondary" isStandalone>
          Writing
        </Link>
        <Link
          href="https://hpc-wiki.info/hpc/HPC_Wiki"
          color="secondary"
          isExternalLink
          isStandalone
        >
          Classic wiki
        </Link>
      </HStack>
    </HStack>
  );
}
