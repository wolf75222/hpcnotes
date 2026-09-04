import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";

export function EmptyNotes({
  title,
  description,
  actionHref = "/",
  actionLabel = "All notes",
  headingLevel = 2,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return (
    <VStack gap={2}>
      {headingLevel === 1 ? (
        <Heading level={1}>{title}</Heading>
      ) : (
        <Text>{title}</Text>
      )}
      <Text type="supporting">{description}</Text>
      <Link href={actionHref} color="secondary" type="supporting" isStandalone>
        {actionLabel}
      </Link>
    </VStack>
  );
}
