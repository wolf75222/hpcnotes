import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

const DOTS = ".".repeat(200);

export function LeaderRow({
  href,
  label,
  meta,
  extra,
  depth = 0,
  onNavigate,
}: {
  href: string;
  label: string;
  meta?: string;
  extra?: React.ReactNode;
  depth?: number;
  onNavigate?: () => void;
}) {
  return (
    <VStack gap={1} className="note-row" data-depth={String(Math.min(depth, 3))}>
      <HStack align="center" gap={2} className="note-row">
        <span className="note-title">
          <Link
            href={href}
            color="primary"
            type="supporting"
            isStandalone
            onClick={onNavigate}
          >
            {label}
          </Link>
        </span>
        {meta != null && meta !== "" ? (
          <>
            <span className="note-leader" aria-hidden="true">
              {DOTS}
            </span>
            <Text type="supporting" color="disabled" textWrap="nowrap" hasTabularNumbers>
              {meta}
            </Text>
          </>
        ) : null}
      </HStack>
      {extra}
    </VStack>
  );
}
