import { Heading } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";

export function SiteBrand({ isHeading = false }: { isHeading?: boolean }) {
  const name = isHeading ? (
    <Heading level={1} display="inline">
      HPC Wiki
    </Heading>
  ) : (
    <Link href="/" color="primary" weight="semibold" isStandalone>
      HPC Wiki
    </Link>
  );

  return (
    <HStack gap={3} align="end" wrap="wrap">
      {name}
      <Text color="secondary">Site-independent notes</Text>
    </HStack>
  );
}
