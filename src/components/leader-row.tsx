import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

const DOTS = ".".repeat(200);

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
    <VStack gap={1} className="note-row">
      <HStack align="center" gap={2} className="note-row">
        <Link href={href} color="primary" isStandalone onClick={onNavigate}>
          {label}
        </Link>
        <span className="note-leader" aria-hidden="true">
          {DOTS}
        </span>
        <Text type="supporting" color="disabled" textWrap="nowrap" hasTabularNumbers>
          {meta}
        </Text>
      </HStack>
      {extra}
    </VStack>
  );
}
