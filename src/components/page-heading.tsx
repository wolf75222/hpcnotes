import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";

export function PageHeading({
  title,
  summary,
}: {
  title: string;
  summary?: string;
}) {
  return (
    <VStack gap={2}>
      <Heading level={1}>{title}</Heading>
      {summary ? <Text color="secondary">{summary}</Text> : null}
    </VStack>
  );
}
