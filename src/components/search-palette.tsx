"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import { filterNotes } from "@/content/query";
import { LeaderRow } from "@/components/leader-row";
import { NoteList } from "@/components/note-list";
import { EmptyNotes } from "@/components/empty-notes";
import { normalizeTag } from "@/lib/slugs";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.closest("input, textarea, select, [contenteditable='true']") != null
  );
}

function useSearchHotkeys(
  open: boolean,
  onOpenChange: (open: boolean) => void,
) {
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
      if (event.key === "Escape" && open) {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (
        event.key === "/" &&
        !open &&
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
}

function SearchPanel({
  notes,
  onClose,
}: {
  notes: NoteIndex[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase().slice(0, 120);

  const thoughts = useMemo(() => {
    return [...filterNotes(notes, query)].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [notes, query]);

  const tags = useMemo(() => {
    if (needle === "") {
      return [];
    }
    const counts = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags) {
        const name = normalizeTag(tag);
        if (`#${name}`.includes(needle) || name.includes(needle)) {
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      }
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [needle, notes]);

  const openFirst = () => {
    const first = thoughts[0];
    if (first == null) {
      return;
    }
    onClose();
    router.push(`/notes/${first.slug}`);
  };

  return (
    <VStack gap={8}>
      <input
        id="paper-search"
        className="paper-search-field"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value.slice(0, 120))}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            openFirst();
          }
        }}
        aria-label="Search thoughts"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="search"
        autoFocus
        placeholder="Title, #tag, or a few words"
      />
      {needle === "" ? (
        <Text type="supporting" color="secondary">
          Type a title, a #tag, or a few words.
        </Text>
      ) : thoughts.length === 0 && tags.length === 0 ? (
        <EmptyNotes
          title="Nothing matches"
          description="Try another word, or a #tag."
          actionLabel={null}
        />
      ) : (
        <VStack gap={8}>
          {thoughts.length > 0 ? (
            <NoteList notes={thoughts} onNavigate={onClose} />
          ) : null}
          {tags.length > 0 ? (
            <VStack gap={5}>
              {tags.map(([tag, count]) => (
                <LeaderRow
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  label={`#${tag}`}
                  meta={String(count)}
                  onNavigate={onClose}
                />
              ))}
            </VStack>
          ) : null}
        </VStack>
      )}
    </VStack>
  );
}

export function SearchPalette({
  notes,
  open,
  onOpenChange,
  children,
}: {
  notes: NoteIndex[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useSearchHotkeys(open, onOpenChange);

  if (open) {
    return <SearchPanel notes={notes} onClose={() => onOpenChange(false)} />;
  }

  return children;
}
