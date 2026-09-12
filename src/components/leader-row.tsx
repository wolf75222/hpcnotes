import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

const DOTS = ".".repeat(200);

function LeaderMeta({
  href,
  meta,
  onNavigate,
}: {
  href?: string;
  meta: string;
  onNavigate?: () => void;
}) {
  const dots = (
    <span className="note-leader" aria-hidden="true">
      {DOTS}
    </span>
  );
  const value = (
    <Text type="supporting" color="secondary" textWrap="nowrap" hasTabularNumbers>
      {meta}
    </Text>
  );
  if (href == null) {
    return (
      <>
        {dots}
        {value}
      </>
    );
  }
  return (
    <>
      <Link
        href={href}
        className="note-leader-hit"
        color="secondary"
        type="supporting"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onNavigate}
      >
        {dots}
      </Link>
      <Link
        href={href}
        className="note-meta-link"
        color="secondary"
        type="supporting"
        isStandalone
        tabIndex={-1}
        aria-hidden="true"
        onClick={onNavigate}
      >
        {value}
      </Link>
    </>
  );
}

export function LeaderRow({
  href,
  label,
  meta,
  extra,
  mark,
  depth = 0,
  onNavigate,
}: {
  href?: string;
  label: string;
  meta?: string;
  extra?: React.ReactNode;
  mark?: React.ReactNode;
  depth?: number;
  onNavigate?: () => void;
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
          <LeaderMeta
            href={href}
            meta={meta}
            onNavigate={onNavigate}
          />
        ) : null}
      </HStack>
      {extra}
    </VStack>
  );
}
