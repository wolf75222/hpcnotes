import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";

const DOTS = ".".repeat(200);

function LeaderMeta({
  href,
  meta,
  label,
  onNavigate,
}: {
  href?: string;
  meta: string;
  label: string;
  onNavigate?: () => void;
}) {
  const trail = (
    <>
      <span className="note-leader" aria-hidden="true">
        {DOTS}
      </span>
      <Text type="supporting" color="secondary" textWrap="nowrap" hasTabularNumbers>
        {meta}
      </Text>
    </>
  );
  if (href == null) {
    return trail;
  }
  return (
    <Link
      href={href}
      className="note-meta-hit"
      color="secondary"
      type="supporting"
      isStandalone
      label={label}
      onClick={onNavigate}
    >
      {trail}
    </Link>
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
  const metaLabel = ariaLabel ?? label;
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
            label={metaLabel}
            onNavigate={onNavigate}
          />
        ) : null}
      </HStack>
      {extra}
    </VStack>
  );
}
