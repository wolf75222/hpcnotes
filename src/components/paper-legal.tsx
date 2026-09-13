import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";

export function PaperLegal({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <HStack
      gap={2}
      align="center"
      wrap="wrap"
      className="paper-legal"
      as="nav"
      aria-label="Legal"
    >
      <Link
        href="/privacy"
        className="paper-legal-link"
        color="secondary"
        type="supporting"
        isStandalone
        hasUnderline
        rel="privacy-policy"
        onClick={onNavigate}
      >
        Privacy
      </Link>
      <Text type="supporting" color="secondary">
        ·
      </Text>
      <Link
        href="/terms"
        className="paper-legal-link"
        color="secondary"
        type="supporting"
        isStandalone
        hasUnderline
        onClick={onNavigate}
      >
        Terms
      </Link>
    </HStack>
  );
}
