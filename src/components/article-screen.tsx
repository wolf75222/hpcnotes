"use client";

import { useCallback } from "react";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Token } from "@astryxdesign/core/Token";
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs";
import { Outline, parseOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { List, ListItem } from "@astryxdesign/core/List";
import { Selector } from "@astryxdesign/core/Selector";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { MarkdownDoc } from "@/components/markdown-doc";
import { AdSlot } from "@/components/ad-slot";
import type { TokenColor } from "@/content/types";

export interface ArticleRelated {
  href: string;
  title: string;
  description: string;
}

export function ArticleScreen({
  crumbs,
  kicker,
  kickerHref,
  kickerColor,
  title,
  description,
  meta,
  body,
  related,
}: {
  crumbs: { href?: string; label: string; isCurrent?: boolean }[];
  kicker: string;
  kickerHref?: string;
  kickerColor: TokenColor;
  title: string;
  description: string;
  meta: string;
  body: string;
  related: ArticleRelated[];
}) {
  const isNarrow = useMediaQuery("(max-width: 1024px)");
  const outlineItems = parseOutlineFromMarkdown(body);
  const outlineOptions = outlineItems.map((item) => ({
    value: item.id,
    label: item.label,
  }));

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target != null) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  return (
    <Layout
      height="auto"
      contentWidth={960}
      padding={6}
      header={
        <LayoutHeader>
          <VStack gap={3}>
            <Breadcrumbs label="Location" variant="supporting">
              {crumbs.map((crumb) => (
                <BreadcrumbItem
                  key={crumb.label}
                  href={crumb.href}
                  isCurrent={crumb.isCurrent}
                >
                  {crumb.label}
                </BreadcrumbItem>
              ))}
            </Breadcrumbs>
            <HStack gap={2} vAlign="center" wrap="wrap">
              <Token
                label={kicker}
                color={kickerColor}
                href={kickerHref}
                size="sm"
              />
              <Text type="supporting">{meta}</Text>
            </HStack>
            <Heading level={1}>{title}</Heading>
            <Text color="secondary">{description}</Text>
            {isNarrow && outlineItems.length > 0 ? (
              <Selector
                label="On this page"
                options={outlineOptions}
                onChange={scrollToId}
                width="100%"
              />
            ) : null}
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent>
          <VStack gap={8}>
            <MarkdownDoc>{body}</MarkdownDoc>
            {related.length > 0 ? (
              <List
                header={<Heading level={2}>Related</Heading>}
                hasDividers
              >
                {related.map((item) => (
                  <ListItem
                    key={item.href}
                    label={item.title}
                    description={item.description}
                    href={item.href}
                  />
                ))}
              </List>
            ) : null}
            {isNarrow ? <AdSlot placement="article" /> : null}
          </VStack>
        </LayoutContent>
      }
      end={
        isNarrow ? undefined : (
          <LayoutPanel
            width={280}
            hasDivider
            isScrollable={false}
            label="On this page"
            role="complementary"
          >
            <VStack gap={6}>
              {outlineItems.length > 0 ? (
                <Outline items={outlineItems} label="On this page" />
              ) : null}
              <AdSlot placement="sidebar" />
            </VStack>
          </LayoutPanel>
        )
      }
    />
  );
}

