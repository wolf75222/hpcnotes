import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { Section } from "@astryxdesign/core/Section";
import { PageTrail } from "@/components/page-trail";

export function PageHeading({
  title,
  summary,
  trail,
}: {
  title: string;
  summary?: string;
  trail?: { href?: string; label: string; current?: boolean }[];
}) {
  return (
    <Section padding={0}>
      <VStack gap={3}>
        {trail && trail.length > 0 ? <PageTrail items={trail} /> : null}
        <VStack gap={2}>
          <Heading level={1}>{title}</Heading>
          {summary ? <Text color="secondary">{summary}</Text> : null}
        </VStack>
      </VStack>
    </Section>
  );
}
