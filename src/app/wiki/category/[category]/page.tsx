import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/Stack";
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs";
import { PageFrame } from "@/components/page-frame";
import { AUDIENCE_BY_ID, AUDIENCES } from "@/content/audiences";
import { getWikiPages } from "@/content/catalog";
import type { WikiAudience } from "@/content/types";

const AUDIENCE_IDS = AUDIENCES.map((audience) => audience.id);

function isAudience(value: string): value is WikiAudience {
  return AUDIENCE_IDS.includes(value as WikiAudience);
}

export function generateStaticParams() {
  return AUDIENCES.map((audience) => ({ category: audience.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isAudience(category)) {
    return { title: "Not found" };
  }
  const audience = AUDIENCE_BY_ID[category];
  return { title: audience.title, description: audience.summary };
}

export default async function WikiCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isAudience(category)) {
    notFound();
  }
  const audience = AUDIENCE_BY_ID[category];
  const pages = getWikiPages(category);

  return (
    <PageFrame>
      <VStack gap={6}>
        <Breadcrumbs label="Location" variant="supporting">
          <BreadcrumbItem href="/">HPC Wiki</BreadcrumbItem>
          <BreadcrumbItem href="/wiki">Wiki</BreadcrumbItem>
          <BreadcrumbItem isCurrent>{audience.title}</BreadcrumbItem>
        </Breadcrumbs>
        <VStack gap={2}>
          <Token label={audience.shortTitle} color={audience.tokenColor} size="sm" />
          <Heading level={1}>{audience.title}</Heading>
          <Text color="secondary">{audience.summary}</Text>
        </VStack>
        <List header={<Heading level={2}>Articles</Heading>} hasDividers>
          {pages.map((page) => (
            <ListItem
              key={page.slug}
              label={page.title}
              description={page.summary}
              href={`/wiki/${page.slug}`}
            />
          ))}
        </List>
      </VStack>
    </PageFrame>
  );
}
