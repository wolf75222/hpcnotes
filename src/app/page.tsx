import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { Grid } from "@astryxdesign/core/Grid";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { List, ListItem } from "@astryxdesign/core/List";
import { Token } from "@astryxdesign/core/Token";
import { Banner } from "@astryxdesign/core/Banner";
import { PageFrame } from "@/components/page-frame";
import { AppIcon } from "@/components/app-icon";
import { AdSlot } from "@/components/ad-slot";
import { AUDIENCES } from "@/content/audiences";
import { WIKI_PAGES } from "@/content/wiki";
import { getLatestBlogPosts } from "@/content/catalog";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "HPC Wiki",
  description:
    "Site-independent high-performance computing: a modern wiki and blog covering basics, users, developers, and admins.",
};

export default function HomePage() {
  const featured = WIKI_PAGES.filter((page) =>
    ["getting-started", "batch-systems", "mpi", "gpu-computing"].includes(
      page.slug,
    ),
  );
  const posts = getLatestBlogPosts(3);

  return (
    <PageFrame>
      <VStack gap={8}>
        <Card variant="muted" padding={8}>
          <VStack gap={4}>
            <Token label="Wiki + blog" color="blue" size="sm" />
            <Heading level={1} type="display-1">
              HPC Wiki
            </Heading>
            <Text type="large" color="secondary">
              Site-independent high-performance computing: the portable
              practice behind login nodes, batch systems, MPI, GPUs, and the
              filesystems they share. Local docs still own hostnames. This
              site owns the concepts.
            </Text>
            <HStack gap={2} wrap="wrap">
              <Button
                label="Get started"
                variant="primary"
                href="/wiki/getting-started"
                icon={<AppIcon name="graduation" />}
              />
              <Button
                label="Browse the wiki"
                variant="secondary"
                href="/wiki"
                icon={<AppIcon name="book" />}
              />
              <Button
                label="Read the blog"
                variant="ghost"
                href="/blog"
                icon={<AppIcon name="newspaper" />}
              />
            </HStack>
          </VStack>
        </Card>

        <Banner
          status="info"
          title="Same audiences as the classic HPC Wiki"
          description="Basics, HPC users, developers, and admins — rewritten for a modern reading layout, with a blog beside the wiki."
          container="card"
          isDismissable
          endContent={
            <Button
              label="Open classic wiki"
              variant="ghost"
              size="sm"
              href="https://hpc-wiki.info/hpc/HPC_Wiki"
              target="_blank"
            />
          }
        />

        <VStack gap={3}>
          <Heading level={2}>Target groups</Heading>
          <Text color="secondary">
            Pick the material that matches how you use the machine. You can
            always move between groups later.
          </Text>
          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            {AUDIENCES.map((audience) => (
              <ClickableCard
                key={audience.id}
                label={audience.title}
                href={audience.href}
                elevation="low"
              >
                <VStack gap={2}>
                  <Token label={audience.shortTitle} color={audience.tokenColor} size="sm" />
                  <Text weight="semibold">{audience.title}</Text>
                  <Text color="secondary">{audience.summary}</Text>
                </VStack>
              </ClickableCard>
            ))}
          </Grid>
        </VStack>

        <List header={<Heading level={2}>Start here</Heading>} hasDividers>
          {featured.map((page) => (
            <ListItem
              key={page.slug}
              label={page.title}
              description={page.summary}
              href={`/wiki/${page.slug}`}
              endContent={
                <Token
                  label={AUDIENCES.find((item) => item.id === page.audience)?.shortTitle ?? page.audience}
                  size="sm"
                />
              }
            />
          ))}
        </List>

        <List header={<Heading level={2}>From the blog</Heading>} hasDividers>
          {posts.map((post) => (
            <ListItem
              key={post.slug}
              label={post.title}
              description={`${formatDate(post.date)} · ${post.summary}`}
              href={`/blog/${post.slug}`}
            />
          ))}
        </List>

        <AdSlot placement="infeed" />
      </VStack>
    </PageFrame>
  );
}
