"use client";

import { useMemo, useState } from "react";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { List, ListItem } from "@astryxdesign/core/List";
import { Token } from "@astryxdesign/core/Token";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Button } from "@astryxdesign/core/Button";
import { VStack } from "@astryxdesign/core/Stack";
import { Icon } from "@astryxdesign/core/Icon";
import { Search } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { searchContent } from "@/content/catalog";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const hits = useMemo(() => searchContent(query), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <PageFrame>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading level={1}>Search</Heading>
          <Text color="secondary">
            Filter wiki articles, blog posts, and section landings. You can
            also open the same index from anywhere with the search control in
            the header.
          </Text>
        </VStack>
        <TextInput
          label="Search HPC Wiki"
          placeholder="Slurm, MPI, GPU, modules…"
          value={query}
          onChange={setQuery}
          startIcon={Search}
          width="100%"
        />
        {!hasQuery ? (
          <EmptyState
            title="Type a topic to search"
            description="Try “walltime”, “CUDA_VISIBLE_DEVICES”, or “Lustre”. The command palette (keyboard shortcut in the header) uses the same index."
            icon={<Icon icon={Search} />}
            headingLevel={2}
          />
        ) : hits.length === 0 ? (
          <EmptyState
            title={`No matches for “${query.trim()}”`}
            description="Try a shorter term, or browse the wiki by audience."
            icon={<Icon icon={Search} />}
            headingLevel={2}
            actions={
              <Button label="Browse the wiki" variant="primary" href="/wiki" />
            }
          />
        ) : (
          <List
            header={
              <Heading level={2}>
                {hits.length} {hits.length === 1 ? "result" : "results"}
              </Heading>
            }
            hasDividers
          >
            {hits.map((hit) => (
              <ListItem
                key={hit.href}
                label={hit.title}
                description={hit.description}
                href={hit.href}
                endContent={<Token label={hit.group} size="sm" />}
              />
            ))}
          </List>
        )}
      </VStack>
    </PageFrame>
  );
}
