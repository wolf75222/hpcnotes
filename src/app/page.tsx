import { Heading, Text } from "@astryxdesign/core/Text";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Link } from "@astryxdesign/core/Link";
import { HashTags } from "@/components/hash-tags";
import { getTags } from "@/content/catalog";
import { getNotes } from "@/content/load-notes";
import { formatDotDate } from "@/lib/dates";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";
import { NoteList } from "@/components/note-list";
import { LeaderRow } from "@/components/leader-row";
import { JsonLd } from "@/components/json-ld";
import { getThoughtForest } from "@/content/load-notes";
import { noteContents, splitHomeLists } from "@/content/thoughts";
import { homeJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: `${SITE_NAME} · HPC notes: performance engineering, caches, SIMD, MPI, Slurm`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  alternates: {
    types: { "text/markdown": "/llms.txt" },
  },
});

export default function HomePage() {
  const forest = getThoughtForest();
  const { notes, thoughts } = splitHomeLists(forest);
  const all = getNotes();
  const latest = all
    .map((note) => note.updated ?? note.date)
    .sort()
    .at(-1);
  const tags = getTags().map((item) => item.tag);
  // Same numbering as the contents list inside the guide.
  const chaptersOf = (slug: string) => {
    const root = forest.find((node) => node.note.slug === slug);
    return root == null
      ? []
      : noteContents([root]).filter((page) => page.depth === 0 && !page.isRoot);
  };

  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <VStack gap={0}>
      <VisuallyHidden>
        <Heading level={1}>hpcnotes: HPC notes and wiki</Heading>
      </VisuallyHidden>
      <VStack gap={0} className="home-intro home-reveal">
        <Text type="supporting" color="secondary" className="home-lede">
          HPC notes and wiki: short, practical notes on high-performance
          computing and performance engineering, from CPU caches and SIMD to
          MPI, GPUs and Slurm clusters.
        </Text>
        <Text type="supporting" className="home-colophon" hasTabularNumbers>
          {notes.length} {notes.length === 1 ? "note" : "notes"} ·{" "}
          {thoughts.length} {thoughts.length === 1 ? "thought" : "thoughts"} ·{" "}
          {all.length} pages
          {latest != null ? ` · updated ${formatDotDate(latest)}` : ""}
        </Text>
      </VStack>
      <VStack gap={10} className="home-columns">
        {notes.length > 0 ? (
          <VStack gap={5} className="home-reveal" style={{ "--i": 1 } as React.CSSProperties}>
            <Text type="supporting" color="secondary">
              <span className="home-group">Notes</span>
            </Text>
            <VStack gap={8}>
              {notes.map((guide) => {
                const chapters = chaptersOf(guide.slug);
                return (
                  <VStack gap={3} key={guide.slug}>
                    <NoteList notes={[guide]} showSummary />
                    {chapters.length > 0 ? (
                      <VStack
                        gap={1}
                        as="nav"
                        aria-label={`${guide.title} chapters`}
                        className="home-chapters"
                      >
                        {chapters.map((chapter) => (
                          <LeaderRow
                            key={chapter.slug}
                            href={`/notes/${chapter.slug}`}
                            label={chapter.title}
                            meta={chapter.label}
                            depth={1}
                          />
                        ))}
                      </VStack>
                    ) : null}
                  </VStack>
                );
              })}
            </VStack>
          </VStack>
        ) : null}
        {thoughts.length > 0 ? (
          <VStack gap={5} className="home-reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <Text type="supporting" color="secondary">
              <span className="home-group">Thoughts</span>
            </Text>
            <NoteList notes={thoughts} showSummary />
          </VStack>
        ) : null}
        {notes.length === 0 && thoughts.length === 0 ? (
          <NoteList
            notes={[]}
            empty="Nothing published yet."
            actionLabel={null}
          />
        ) : null}
      </VStack>
      <VStack gap={6} className="home-foot home-reveal" style={{ "--i": 3 } as React.CSSProperties}>
        {tags.length > 0 ? (
          <VStack gap={3}>
            <Text type="supporting" color="secondary">
              <span className="home-group">Topics</span>
            </Text>
            <HashTags tags={tags} />
          </VStack>
        ) : null}
        <HStack gap={4} wrap="wrap" as="nav" aria-label="Elsewhere" className="home-links">
          <Link href="/feed.xml" color="secondary" type="supporting" isStandalone>
            RSS
          </Link>
          <Link href="/llms.txt" color="secondary" type="supporting" isStandalone>
            llms.txt
          </Link>
          <Link
            href="https://github.com/wolf75222/hpcnotes"
            color="secondary"
            type="supporting"
            isStandalone
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link href="/privacy" color="secondary" type="supporting" isStandalone>
            Privacy
          </Link>
        </HStack>
      </VStack>
    </VStack>
    </>
  );
}
