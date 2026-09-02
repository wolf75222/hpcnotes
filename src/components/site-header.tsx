"use client";

import { usePathname } from "next/navigation";
import { Heading } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <HStack justify="between" align="start" wrap="wrap" gap={4}>
      {isHome ? (
        <Heading level={1} display="inline">
          HPC
        </Heading>
      ) : (
        <Link href="/" color="primary" weight="semibold" isStandalone>
          HPC
        </Link>
      )}
      <HStack gap={2} align="center" wrap="wrap">
        <Link href="/" color="secondary" isStandalone size="sm">
          Writing
        </Link>
        <Text type="supporting">|</Text>
        <Link
          href="https://hpc-wiki.info/hpc/HPC_Wiki"
          color="secondary"
          isStandalone
          size="sm"
          isExternalLink
        >
          Classic wiki
        </Link>
      </HStack>
    </HStack>
  );
}
