"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@astryxdesign/core/CommandPalette";
import { PowerSearch, createPowerSearchConfig } from "@astryxdesign/core/PowerSearch";
import type { PowerSearchFilter } from "@astryxdesign/core/PowerSearch";
import { createStaticSource } from "@astryxdesign/core/Typeahead";
import type { SearchableItem } from "@astryxdesign/core/Typeahead";
import { Text } from "@astryxdesign/core/Text";
import { HStack } from "@astryxdesign/core/Stack";
import type { Note } from "@/content/types";
import { formatDotDate } from "@/lib/dates";

type SortKey = "newest" | "oldest" | "title";

type ThoughtRow = {
  text: string;
  tags: readonly string[];
  slug: string;
  title: string;
  date: string;
};

type PaletteItem = SearchableItem<{
  group: string;
  kind: "thought" | "tag";
  slug?: string;
  tag?: string;
  date?: string;
}>;

const SORT_VALUES = [
  { value: "newest", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
] as const;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.closest("input, textarea, select, [contenteditable='true']") != null
  );
}

function sortFromFilters(filters: ReadonlyArray<PowerSearchFilter>): SortKey {
  const entry = filters.find((filter) => filter.field === "sort");
  if (entry?.value.type === "enum") {
    const value = entry.value.value;
    if (value === "oldest" || value === "title" || value === "newest") {
      return value;
    }
  }
  return "newest";
}

function sortRows(rows: ThoughtRow[], sort: SortKey) {
  const next = [...rows];
  if (sort === "oldest") {
    next.sort((a, b) => a.date.localeCompare(b.date));
  } else if (sort === "title") {
    next.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    next.sort((a, b) => b.date.localeCompare(a.date));
  }
  return next;
}

export function SearchPalette({
  notes,
  open,
  onOpenChange,
}: {
  notes: Note[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<PowerSearchFilter[]>([]);

  const tagEnums = useMemo(() => {
    const tags = new Set<string>();
    for (const note of notes) {
      for (const tag of note.tags) {
        tags.add(tag);
      }
    }
    return [...tags]
      .sort((a, b) => a.localeCompare(b))
      .map((tag) => ({ value: tag, label: `#${tag}` }));
  }, [notes]);

  const { config, applyFilters } = useMemo(() => {
    const built = createPowerSearchConfig(
      [
        { key: "text", type: "string", label: "Text" },
        {
          key: "tags",
          type: "enum_list",
          label: "Tag",
          enumValues: tagEnums,
        },
      ] as const,
      "thoughts",
    );
    return {
      applyFilters: built.applyFilters,
      config: {
        ...built.config,
        contentSearchFieldKey: "text",
        fields: [
          ...built.config.fields,
          {
            key: "sort",
            label: "Sort",
            defaultOperator: "is",
            operators: [
              {
                key: "is",
                label: "is",
                value: { type: "enum" as const, values: [...SORT_VALUES] },
              },
            ],
          },
        ],
      },
    };
  }, [tagEnums]);

  const rows = useMemo<ThoughtRow[]>(
    () =>
      notes.map((note) => ({
        text: [note.title, note.summary, note.body, note.tags.join(" ")].join(
          "\n",
        ),
        tags: note.tags,
        slug: note.slug,
        title: note.title,
        date: note.date,
      })),
    [notes],
  );

  const visibleRows = useMemo(() => {
    const dataFilters = filters.filter((filter) => filter.field !== "sort");
    return sortRows(applyFilters(dataFilters, rows), sortFromFilters(filters));
  }, [applyFilters, filters, rows]);

  const items = useMemo<PaletteItem[]>(() => {
    const thoughts: PaletteItem[] = visibleRows.slice(0, 12).map((row) => ({
      id: `thought:${row.slug}`,
      label: row.title,
      auxiliaryData: {
        group: "Thoughts",
        kind: "thought" as const,
        slug: row.slug,
        date: row.date,
      },
    }));

    const counts = new Map<string, number>();
    for (const row of visibleRows) {
      for (const tag of row.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const tags: PaletteItem[] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .map(([tag, count]) => ({
        id: `tag:${tag}`,
        label: `#${tag}`,
        auxiliaryData: {
          group: "Tags",
          kind: "tag" as const,
          tag,
          date: String(count),
        },
      }));

    return [...thoughts, ...tags];
  }, [visibleRows]);

  const source = useMemo(
    () =>
      createStaticSource(items, {
        keywords: (item) => {
          if (item.auxiliaryData?.kind === "thought") {
            const row = visibleRows.find((entry) => entry.slug === item.auxiliaryData?.slug);
            return row ? [row.text, ...row.tags] : [];
          }
          return [item.auxiliaryData?.tag ?? ""];
        },
      }),
    [items, visibleRows],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <CommandPalette
      key={
        filters
          .map(
            (filter) =>
              `${filter.field}:${filter.operator}:${JSON.stringify(filter.value)}`,
          )
          .join("|") || "none"
      }
      isOpen
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setFilters([]);
        }
      }}
      searchSource={source}
      label="Search thoughts"
      width={560}
      emptySearchText="Nothing matches."
      emptyBootstrapText="Add a tag, sort by most recent, or type some text."
      onValueChange={(value) => {
        if (value.startsWith("thought:")) {
          router.push(`/notes/${value.slice("thought:".length)}`);
          return;
        }
        if (value.startsWith("tag:")) {
          router.push(`/tags/${encodeURIComponent(value.slice("tag:".length))}`);
        }
      }}
      input={
        <PowerSearch
          className="note-row"
          config={config}
          filters={filters}
          onChange={(next) => setFilters([...next])}
          label="Search thoughts"
          placeholder="Text, tag, or sort…"
          hasAutoFocus
          hasClear
          startIcon="search"
          resultCount={visibleRows.length}
          size="md"
        />
      }
      renderItem={(item) => {
        const meta = item.auxiliaryData;
        const trailing =
          meta?.kind === "thought" && meta.date != null
            ? formatDotDate(meta.date)
            : meta?.kind === "tag" && meta.date != null
              ? meta.date
              : "";
        return (
          <HStack justify="between" gap={3} align="center" className="note-row">
            <Text>{item.label}</Text>
            {trailing !== "" ? (
              <Text type="supporting" textWrap="nowrap" hasTabularNumbers>
                {trailing}
              </Text>
            ) : null}
          </HStack>
        );
      }}
    />
  );
}
