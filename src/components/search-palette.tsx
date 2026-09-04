"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@astryxdesign/core/Dialog";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note } from "@/content/types";
import { filterNotes } from "@/content/query";
import { LeaderRow } from "@/components/leader-row";
import { formatDotDate } from "@/lib/dates";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.closest("input, textarea, select, [contenteditable='true']") != null
  );
}

function matchingTags(notes: Note[], query: string) {
  const needle = query.replace(/^#/, "").toLowerCase();
  if (needle === "") {
    return [];
  }
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.tags) {
      if (tag.toLowerCase().includes(needle)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([tag, count]) => ({ tag, count }));
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
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const searchNeedle = trimmed.replace(/^#/, "");
  const results = useMemo(
    () => filterNotes(notes, searchNeedle).slice(0, 8),
    [notes, searchNeedle],
  );
  const tags = useMemo(
    () => matchingTags(notes, trimmed),
    [notes, trimmed],
  );

  const close = () => {
    onOpenChange(false);
    setQuery("");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        onOpenChange(!open);
        if (open) {
          setQuery("");
        }
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

  const goNote = (slug: string) => {
    close();
    router.push(`/notes/${slug}`);
  };

  const goTag = (tag: string) => {
    close();
    router.push(`/tags/${encodeURIComponent(tag)}`);
  };

  if (!open) {
    return null;
  }

  const hasHits = tags.length > 0 || results.length > 0;

  return (
    <Dialog
      isOpen
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery("");
        }
      }}
      width={560}
      purpose="info"
      padding={4}
      aria-label="Search notes"
    >
      <VStack gap={4}>
        <TextInput
          label="Search notes"
          isLabelHidden
          value={query}
          onChange={(value) => setQuery(value)}
          placeholder="a tool, a tag, a phrase"
          hasClear
          hasAutoFocus
          width="100%"
          onEnter={() => {
            const firstTag = tags[0];
            const firstNote = results[0];
            if (trimmed === "") {
              return;
            }
            if (firstTag != null) {
              goTag(firstTag.tag);
              return;
            }
            if (firstNote != null) {
              goNote(firstNote.slug);
            }
          }}
        />
        {trimmed === "" ? null : !hasHits ? (
          <Text type="supporting">Nothing matches.</Text>
        ) : (
          <VStack gap={3}>
            {tags.map(({ tag, count }) => (
              <LeaderRow
                key={`tag-${tag}`}
                href={`/tags/${encodeURIComponent(tag)}`}
                label={`#${tag}`}
                meta={String(count)}
                onNavigate={close}
              />
            ))}
            {results.map((note) => (
              <LeaderRow
                key={note.slug}
                href={`/notes/${note.slug}`}
                label={note.title}
                meta={formatDotDate(note.date)}
                onNavigate={close}
              />
            ))}
          </VStack>
        )}
      </VStack>
    </Dialog>
  );
}
