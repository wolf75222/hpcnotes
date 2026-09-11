import { Spinner } from "@astryxdesign/core/Spinner";
import { VStack } from "@astryxdesign/core/Stack";

export default function Loading() {
  return (
    <VStack gap={4} paddingBlock={8} align="start">
      <Spinner size="md" shade="subtle" label="Loading" />
    </VStack>
  );
}
