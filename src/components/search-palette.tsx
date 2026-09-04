"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note } from "@/content/types";
import { LeaderRow } from "@/components/leader-row";
import { NoteList } from "@/components/note-list";
import { EmptyNotes } from "@/components/empty-notes";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.closest("input, textarea, select, [contenteditable='true']") != null
  );
}

function matchesNote(note: Note, query: string) {
  const hay = [
    note.title,
    note.summary,
    note.tags.map((tag) => `#${tag}`).join(" "),
    note.body,
  ]
    .join("\n")
    .toLowerCase();
  return hay.includes(query);
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
  notes: Note[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const thoughts = useMemo(() => {
    const rows =
      needle === "" ? notes : notes.filter((note) => matchesNote(note, needle));
    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [needle, notes]);

  const tags = useMemo(() => {
    if (needle === "") {
      return [];
    }
    const counts = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags) {
        if (`#${tag}`.includes(needle) || tag.toLowerCase().includes(needle)) {
          counts.set(tag, (counts.get(tag) ?? 0) + 1);
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
        className="paper-search-field"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            openFirst();
          }
        }}
        aria-label="Search thoughts"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus
        placeholder="Title, #tag, or a few words"
      />
      {thoughts.length === 0 && tags.length === 0 ? (
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
  notes: Note[];
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
