"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandPalette,
  CommandPaletteInput,
} from "@astryxdesign/core/CommandPalette";
import { createStaticSource } from "@astryxdesign/core/Typeahead";
import { Kbd } from "@astryxdesign/core/Kbd";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { getAllSearchHits } from "@/content/catalog";

export function SearchPalette({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const hits = useMemo(() => getAllSearchHits(), []);
  const searchSource = useMemo(
    () =>
      createStaticSource(
        hits.map((hit) => ({
          id: hit.href,
          label: hit.title,
          auxiliaryData: {
            group: hit.group,
            description: hit.description,
            href: hit.href,
          },
        })),
        {
          keywords: (item) => [
            item.auxiliaryData?.description ?? "",
            item.auxiliaryData?.group ?? "",
          ],
        },
      ),
    [hits],
  );

  return (
    <CommandPalette
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      searchSource={searchSource}
      label="Search HPC Wiki"
      emptySearchText="No matching wiki pages or posts."
      emptyBootstrapText="Type a topic — Slurm, MPI, GPUs, modules…"
      input={
        <CommandPaletteInput
          placeholder="Search the wiki and blog"
          label="Search HPC Wiki"
          endContent={<Kbd keys="mod+k" />}
        />
      }
      renderItem={(item) => (
        <VStack gap={0.5}>
          <Text weight="medium">{item.label}</Text>
          {item.auxiliaryData?.description ? (
            <Text color="secondary" maxLines={1}>
              {item.auxiliaryData.description}
            </Text>
          ) : null}
        </VStack>
      )}
      onValueChange={(href) => {
        onOpenChange(false);
        router.push(href);
      }}
    />
  );
}
