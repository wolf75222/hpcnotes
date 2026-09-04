import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

export function LeaderRow({
  href,
  label,
  meta,
  extra,
  onNavigate,
}: {
  href: string;
  label: string;
  meta: string;
  extra?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <VStack gap={1} className="note-rule">
      <HStack align="baseline" justify="between" gap={4} className="note-row">
        <Link href={href} color="primary" isStandalone onClick={onNavigate}>
          {label}
        </Link>
        <Text type="supporting" textWrap="nowrap" hasTabularNumbers>
          {meta}
        </Text>
      </HStack>
      {extra}
    </VStack>
  );
}
