"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import type { NoteIndex } from "@/content/types";
import { searchNotes, SEARCH_LIMIT } from "@/content/query";
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

type BodyIndex = Readonly<Record<string, string>>;

let bodyIndexPromise: Promise<BodyIndex> | null = null;

/** Fetch note bodies once per page load; titles/tags work without them. */
function loadBodyIndex() {
  bodyIndexPromise ??= fetch("/search-index.json", { credentials: "same-origin" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`search index: ${response.status}`);
      }
      return response.json();
    })
    .then((data: unknown) =>
      data != null && typeof data === "object" ? (data as BodyIndex) : {},
    )
    .catch(() => {
      // Fall back to titles and tags; retry on the next open.
      bodyIndexPromise = null;
      return {};
    });
  return bodyIndexPromise;
}

function useBodyIndex() {
  const [bodies, setBodies] = useState<BodyIndex | null>(null);
  useEffect(() => {
    let live = true;
    void loadBodyIndex().then((index) => {
      if (live) {
        setBodies(index);
      }
    });
    return () => {
      live = false;
    };
  }, []);
  return bodies;
}

function SearchPanel({
  notes,
  onClose,
}: {
  notes: NoteIndex[];
  onClose: () => void;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase().slice(0, 120);

  const bodies = useBodyIndex();
  const thoughts = useMemo(
    () =>
      searchNotes(notes, query, bodies ?? undefined).map((hit) =>
        hit.snippet != null ? { ...hit.note, summary: hit.snippet } : hit.note,
      ),
    [notes, query, bodies],
  );

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
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, SEARCH_LIMIT);
  }, [needle, notes]);

  const openFirst = () => {
    const firstNote = thoughts[0];
    if (firstNote != null) {
      onClose();
      router.push(`/notes/${firstNote.slug}`);
      return;
    }
    const firstTag = tags[0];
    if (firstTag != null) {
      onClose();
      router.push(`/tags/${encodeURIComponent(firstTag[0])}`);
    }
  };

  // Arrow keys walk the results; ArrowUp from the first one returns to the field.
  const onPanelKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    const panel = panelRef.current;
    if (panel == null) {
      return;
    }
    const field = panel.querySelector<HTMLInputElement>("#paper-search");
    const links = [
      ...panel.querySelectorAll<HTMLAnchorElement>('a[href]:not([tabindex="-1"])'),
    ];
    if (links.length === 0) {
      return;
    }
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    if (event.key === "ArrowDown") {
      links[Math.min(at + 1, links.length - 1)]?.focus();
    } else if (at <= 0) {
      field?.focus();
    } else {
      links[at - 1]?.focus();
    }
  };

  return (
    <VStack gap={8} ref={panelRef} onKeyDown={onPanelKeyDown} role="search">
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
        aria-label="Search notes"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="search"
        autoFocus
        placeholder="Title, #tag, or a few words"
      />
      <Text type="supporting" color="secondary" aria-live="polite">
        {needle === ""
          ? "Type a title, a #tag, or a few words. ↑↓ to move, Enter to open, Esc to close."
          : thoughts.length + tags.length === 0
            ? bodies == null
              ? "Loading note text…"
              : ""
            : `${thoughts.length + tags.length} result${thoughts.length + tags.length === 1 ? "" : "s"}`}
      </Text>
      {needle === "" ? null : thoughts.length === 0 && tags.length === 0 ? (
        bodies == null ? null : (
          <EmptyNotes
            title="Nothing matches"
            description="Try another word, or a #tag."
            actionLabel={null}
          />
        )
      ) : (
        <VStack gap={8}>
          {thoughts.length > 0 ? (
            <NoteList notes={thoughts} onNavigate={onClose} showSummary />
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

  // Keep the page mounted while searching: closing the panel then returns to
  // the same reading position without re-rendering diagrams and maths.
  return (
    <>
      {open ? (
        <SearchPanel notes={notes} onClose={() => onOpenChange(false)} />
      ) : null}
      <VStack
        gap={0}
        aria-hidden={open || undefined}
        style={open ? { display: "none" } : undefined}
      >
        {children}
      </VStack>
    </>
  );
}
