import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/Stack";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";
import { NoteList } from "@/components/note-list";
import { JsonLd } from "@/components/json-ld";
import { getThoughtForest } from "@/content/load-notes";
import { splitHomeLists } from "@/content/thoughts";
import { homeJsonLd } from "@/lib/json-ld";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/llms.txt" },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function HomePage() {
  const { notes, thoughts } = splitHomeLists(getThoughtForest());

  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <VStack gap={0}>
      <VisuallyHidden>
        <Heading level={1}>hpcnotes</Heading>
      </VisuallyHidden>
      <VStack gap={0} className="home-intro">
        <Text type="supporting" color="secondary">
          Short notes on high-performance computing, and personal thoughts around
          HPC.
        </Text>
      </VStack>
      <VStack gap={10}>
        {notes.length > 0 ? (
          <VStack gap={5}>
            <Text type="supporting" color="secondary">
              <span className="home-group">Notes</span>
            </Text>
            <NoteList notes={notes} showSummary />
          </VStack>
        ) : null}
        {thoughts.length > 0 ? (
          <VStack gap={5}>
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
    </VStack>
    </>
  );
}
