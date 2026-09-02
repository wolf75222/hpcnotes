"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
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

  return (
    <Dialog
      isOpen={open}
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
      <Layout height="auto" defaultHasDividers={false}>
        <LayoutContent>
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
            {trimmed === "" ? (
              <Text type="supporting" color="secondary">
                Type to find a note.
              </Text>
            ) : results.length === 0 ? (
              <Text type="supporting" color="secondary">
                Nothing matches.
              </Text>
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
        </LayoutContent>
      </Layout>
    </Dialog>
  );
}
