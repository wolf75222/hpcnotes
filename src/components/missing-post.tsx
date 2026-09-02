import { SiteBrand } from "@/components/site-brand";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/Stack";

export function MissingPost() {
  return (
    <VStack gap={6}>
      <SiteBrand />
      <VStack gap={2}>
        <Heading level={1}>That post is not here</Heading>
        <Text color="secondary">
          The slug may have moved, or it never existed.
        </Text>
        <Link href="/" hasUnderline>
          All writing →
        </Link>
      </VStack>
    </VStack>
  );
}
