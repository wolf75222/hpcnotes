import type { ReactNode } from "react";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { LEGAL_UPDATED } from "@/lib/legal";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={3}>
      <Heading level={2} color="primary">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <Text as="p" color="primary">
      {children}
    </Text>
  );
}

export function LegalDoc({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={8} as="article">
      <VStack gap={2}>
        <Heading level={1} color="primary">
          {title}
        </Heading>
        <Text type="supporting" color="secondary">
          Last updated {LEGAL_UPDATED}
        </Text>
      </VStack>
      <VStack gap={8}>{children}</VStack>
    </VStack>
  );
}
