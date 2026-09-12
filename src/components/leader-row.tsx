import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

const DOTS = ".".repeat(200);

export function LeaderRow({
  href,
  label,
  meta,
  extra,
  mark,
  depth = 0,
  onNavigate,
  ariaLabel,
}: {
  href?: string;
  label: string;
  meta?: string;
  extra?: React.ReactNode;
  mark?: React.ReactNode;
  depth?: number;
  onNavigate?: () => void;
  ariaLabel?: string;
}) {
  return (
    <VStack gap={1} className="note-row" data-depth={String(Math.min(depth, 3))}>
      <HStack align="center" gap={mark != null ? 1 : 2} className="note-row">
        <span className="note-title">
          {href != null ? (
            <Link
              href={href}
              color="primary"
              type="supporting"
              isStandalone
              {...(ariaLabel ? { label: ariaLabel } : {})}
              onClick={onNavigate}
            >
              {label}
            </Link>
          ) : (
            <Text type="supporting" weight="semibold">
              {label}
            </Text>
          )}
        </span>
        {mark}
        {meta != null && meta !== "" ? (
          <>
            <span className="note-leader" aria-hidden="true">
              {DOTS}
            </span>
            <Text type="supporting" color="secondary" textWrap="nowrap" hasTabularNumbers>
              {meta}
            </Text>
          </>
        ) : null}
      </HStack>
      {extra}
    </VStack>
  );
}
