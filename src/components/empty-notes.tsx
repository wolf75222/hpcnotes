import type { ReactNode } from "react";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";

export function EmptyNotes({
  title,
  description,
  actionHref = "/",
  actionLabel = "All notes",
  headingLevel = 2,
  extra,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string | null;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  extra?: ReactNode;
}) {
  return (
    <VStack gap={2}>
      {headingLevel === 1 ? (
        <Heading level={1} color="primary">
          {title}
        </Heading>
      ) : (
        <Text color="primary" weight="medium">
          {title}
        </Text>
      )}
      <Text type="supporting" color="secondary">
        {description}
      </Text>
      {extra}
      {actionLabel != null ? (
        <Link href={actionHref} color="secondary" type="supporting" isStandalone>
          {actionLabel}
        </Link>
      ) : null}
    </VStack>
  );
}
