import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";

export default function Loading() {
  return (
    <VStack gap={0}>
      <VisuallyHidden>Loading</VisuallyHidden>
      <Text type="supporting" color="secondary" aria-hidden="true">
        …
      </Text>
    </VStack>
  );
}
