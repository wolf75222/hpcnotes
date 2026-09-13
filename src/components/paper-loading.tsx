import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";

export function PaperLoading() {
  return (
    <VStack gap={0} aria-busy="true">
      <VisuallyHidden>Loading</VisuallyHidden>
      <Text type="supporting" color="secondary" aria-hidden="true">
        …
      </Text>
    </VStack>
  );
}

export default PaperLoading;
