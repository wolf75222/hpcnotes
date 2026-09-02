import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";

export function LeaderRow({
  href,
  label,
  meta,
  extra,
}: {
  href: string;
  label: string;
  meta: string;
  extra?: React.ReactNode;
}) {
  return (
    <VStack gap={1}>
      <HStack align="end" gap={2}>
        <Link href={href} color="primary" isStandalone>
          {label}
        </Link>
        <StackItem size="fill" className="note-leader" />
        <Text type="supporting" textWrap="nowrap" hasTabularNumbers>
          {meta}
        </Text>
      </HStack>
      {extra}
    </VStack>
  );
}
