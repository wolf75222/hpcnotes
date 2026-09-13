import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";

export function PaperLegal() {
  return (
    <HStack gap={2} align="center" wrap="wrap" className="paper-legal">
      <Link
        href="/privacy"
        color="secondary"
        type="supporting"
        isStandalone
        rel="privacy-policy"
      >
        Privacy
      </Link>
      <Text type="supporting" color="secondary">
        ·
      </Text>
      <Link href="/terms" color="secondary" type="supporting" isStandalone>
        Terms
      </Link>
    </HStack>
  );
}
