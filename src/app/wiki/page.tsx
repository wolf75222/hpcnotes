import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import { PageFrame } from "@/components/page-frame";
import { AUDIENCES } from "@/content/audiences";
import { WIKI_PAGES } from "@/content/wiki";
import { getWikiPages } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Wiki",
  description:
    "All HPC Wiki articles, grouped the way the classic wiki grouped people: basics, users, developers, and admins.",
};

export default function WikiIndexPage() {
  return (
    <PageFrame>
      <VStack gap={8}>
        <VStack gap={2}>
          <Heading level={1}>Wiki</Heading>
          <Text color="secondary">
            Portable HPC practice, organised by audience. Every article is
            written to transfer between machines; partition names and login
            hosts still come from your centre.
          </Text>
        </VStack>
        {AUDIENCES.map((audience) => {
          const pages = getWikiPages(audience.id);
          return (
            <List
              key={audience.id}
              hasDividers
              header={
                <VStack gap={1}>
                  <Heading level={2}>{audience.title}</Heading>
                  <Text color="secondary">{audience.summary}</Text>
                </VStack>
              }
            >
              {pages.map((page) => (
                <ListItem
                  key={page.slug}
                  label={page.title}
                  description={page.summary}
                  href={`/wiki/${page.slug}`}
                />
              ))}
            </List>
          );
        })}
        <Text type="supporting">
          {WIKI_PAGES.length} articles across {AUDIENCES.length} audiences.
          Looking for dated notes instead?{" "}
          <Link href="/blog">Open the blog</Link>.
        </Text>
      </VStack>
    </PageFrame>
  );
}
