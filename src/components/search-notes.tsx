"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/Stack";
import type { Note, Playlist } from "@/content/types";
import { filterNotes, searchPlaylists } from "@/content/catalog";
import { NoteList } from "@/components/note-list";
import { LeaderRow } from "@/components/leader-row";

export function SearchNotes({
  notes,
  initialQuery,
}: {
  notes: Note[];
  initialQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const trimmed = query.trim();
  const results = useMemo(() => filterNotes(notes, query), [notes, query]);
  const playlists = useMemo(
    () => (trimmed === "" ? [] : searchPlaylists(query)),
    [query, trimmed],
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next =
        trimmed === "" ? "/search" : `/search?q=${encodeURIComponent(trimmed)}`;
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) {
        router.replace(next, { scroll: false });
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [router, trimmed]);

  return (
    <VStack gap={6}>
      <TextInput
        label="Search notes"
        isLabelHidden
        value={query}
        onChange={setQuery}
        placeholder="Titles, tags, bodies"
        hasClear
        htmlName="q"
        startIcon="search"
        width="100%"
        hasAutoFocus
      />
      {trimmed === "" ? (
        <Text color="secondary">
          Filter by a tool, a tag, or a phrase. Empty search lists every note.
        </Text>
      ) : (
        <Text color="secondary">
          {results.length === 1
            ? "1 note"
            : `${results.length} notes`}
          {playlists.length > 0
            ? `, ${playlists.length === 1 ? "1 playlist" : `${playlists.length} playlists`}`
            : null}
        </Text>
      )}
      {playlists.length > 0 ? (
        <VStack gap={3}>
          <Text type="label" color="secondary">
            Playlists
          </Text>
          {playlists.map((playlist) => (
            <PlaylistHit key={playlist.slug} playlist={playlist} />
          ))}
        </VStack>
      ) : null}
      <NoteList
        notes={results}
        empty={
          trimmed === ""
            ? "No notes published yet."
            : "Nothing matches that phrase. Try a tag or a shorter word."
        }
      />
    </VStack>
  );
}

function PlaylistHit({ playlist }: { playlist: Playlist }) {
  return (
    <LeaderRow
      href={`/playlists/${playlist.slug}`}
      label={playlist.title}
      meta={`${playlist.slugs.length} notes`}
      extra={<Text color="secondary">{playlist.summary}</Text>}
    />
  );
}
