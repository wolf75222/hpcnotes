"use client";

import { Heading, Text } from "@astryxdesign/core/Text";
import { Link } from "@astryxdesign/core/Link";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Section } from "@astryxdesign/core/Section";
import { Divider } from "@astryxdesign/core/Divider";
import { Outline, useOutlineFromMarkdown } from "@astryxdesign/core/Outline";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import type { Note, Playlist } from "@/content/types";
import { formatDotDate } from "@/lib/dates";
import { MarkdownDoc } from "@/components/markdown-doc";
import { TagLinks } from "@/components/tag-links";
import { NoteList } from "@/components/note-list";
import { AdSlot } from "@/components/ad-slot";
import { PageTrail } from "@/components/page-trail";

export function NoteArticle({
  note,
  related,
  playlists,
}: {
  note: Note;
  related: Note[];
  playlists: Playlist[];
}) {
  const items = useOutlineFromMarkdown(note.body);
  const isNarrow = useMediaQuery("(max-width: 64rem)", false);
  const showToc = items.length >= 2 && !isNarrow;
  const year = note.date.slice(0, 4);

  const article = (
    <VStack gap={6}>
      <Section padding={0}>
        <VStack gap={3}>
          <PageTrail
            items={[
              { href: "/", label: "notes" },
              { label: note.title, current: true },
            ]}
          />
          <Link href={`/years/${year}`} color="secondary" isStandalone>
            {formatDotDate(note.date)}
          </Link>
          <Heading level={1}>{note.title}</Heading>
          <Text color="secondary">{note.summary}</Text>
          <TagLinks tags={note.tags} />
          {playlists.length > 0 ? (
            <HStack gap={2} wrap="wrap" align="center">
              <Text type="supporting">in</Text>
              {playlists.map((playlist) => (
                <Link
                  key={playlist.slug}
                  href={`/playlists/${playlist.slug}`}
                  color="secondary"
                  isStandalone
                >
                  {playlist.title}
                </Link>
              ))}
            </HStack>
          ) : null}
        </VStack>
      </Section>
      <MarkdownDoc>{note.body}</MarkdownDoc>
      <AdSlot placement="article" />
      {related.length > 0 ? (
        <Section padding={0}>
          <VStack gap={3}>
            <Divider variant="subtle" />
            <Text type="label" color="secondary">
              Nearby
            </Text>
            <NoteList notes={related} />
          </VStack>
        </Section>
      ) : null}
    </VStack>
  );

  if (!showToc) {
    return article;
  }

  return (
    <HStack align="start" gap={8}>
      <StackItem size="fill">{article}</StackItem>
      <VStack className="note-toc" width={220} gap={3}>
        <Text type="label" color="secondary">
          On this page
        </Text>
        <Outline items={items} density="compact" label="On this page" />
      </VStack>
    </HStack>
  );
}
