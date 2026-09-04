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

export function SearchPalette({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => filterNotes(notes, query).slice(0, 8),
    [notes, query],
  );
  const trimmed = query.trim();

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setOpen((current) => {
          if (current) {
            setQuery("");
          }
          return !current;
        });
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
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  const go = (slug: string) => {
    close();
    router.push(`/notes/${slug}`);
  };

  // Unmount when closed. Astryx Dialog restores focus to the element that was
  // active at open; with `/` that is often the field inside the dialog, which
  // leaves a stray input on the page after Escape.
  if (!open) {
    return null;
  }

  return (
    <Dialog
      isOpen
      onOpenChange={(next) => {
        setOpen(next);
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
            const first = results[0];
            if (trimmed !== "" && first != null) {
              go(first.slug);
            }
          }}
        />
        {trimmed === "" ? null : results.length === 0 ? (
          <Text type="supporting">Nothing matches.</Text>
        ) : (
          <VStack gap={3}>
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
