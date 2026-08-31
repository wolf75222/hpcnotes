import type { Metadata } from "next";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/Stack";
import { List, ListItem } from "@astryxdesign/core/List";
import { Banner } from "@astryxdesign/core/Banner";
import { Link } from "@astryxdesign/core/Link";
import { PageFrame } from "@/components/page-frame";
import { MarkdownDoc } from "@/components/markdown-doc";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "How to add HPC Wiki articles, blog posts, and Google AdSense to this site.",
};

const GUIDE = `HPC Wiki is a Next.js app. Wiki articles and blog posts live as typed content modules, not a database, so a pull request is the editing workflow.

## Add a wiki article

1. Open \`src/content/wiki.ts\`.
2. Append a page with a stable \`slug\`, an audience (\`basics\`, \`user\`, \`developer\`, or \`admin\`), a one-sentence \`summary\`, and Markdown in \`body\`.
3. Link it from related pages. Internal links use paths such as \`[Slurm](/wiki/batch-systems)\`.
4. Keep **hostnames and partition names** out of the prose unless they are clearly examples. Site-independent is the whole point.

## Add a blog post

Same pattern in \`src/content/blog.ts\`. The blog is dated on purpose: opinions, incident write-ups, and tool notes that should not pretend to be evergreen.

## Voice

- Second person, present tense.
- Commands in fenced blocks a reader can paste.
- A table when a paragraph would become a decision tree.
- No “welcome to our site”.

## Google AdSense

Placeholders labelled Advertisement render until you set environment variables. Create a \`.env.local\` file (never commit the publisher id if you treat it as sensitive in your org):

\`\`\`bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=1234567890
\`\`\`

Restart the dev server. Sidebar, in-feed, and in-article slots then load the official AdSense script. Until those values exist, the units stay visible as honest placeholders so layout does not jump.

Apply for AdSense on your production domain, create display units that match those slots, and paste the IDs. Do not click your own ads.

## Classic wiki

The [original HPC Wiki](https://hpc-wiki.info/hpc/HPC_Wiki) remains a useful MediaWiki. This site is a parallel, modern reading surface for the same job: portable HPC knowledge for basics, users, developers, and admins.
`;

export default function ContributePage() {
  return (
    <PageFrame>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading level={1}>Contribute</Heading>
          <Text color="secondary">
            The wiki and the blog are the product. Advertising is optional
            infrastructure so the pages can stay free.
          </Text>
        </VStack>
        <Banner
          status="info"
          title="Edits are pull requests"
          description="There is no in-browser wiki editor yet. Content lives in src/content."
          container="card"
        />
        <MarkdownDoc>{GUIDE}</MarkdownDoc>
        <Card padding={4}>
          <VStack gap={3}>
            <Heading level={2}>Ad unit preview</Heading>
            <Text color="secondary">
              This is the same in-feed slot used on the home and blog indexes.
              It stays a placeholder until AdSense IDs are set.
            </Text>
            <AdSlot placement="infeed" />
          </VStack>
        </Card>
        <List header={<Heading level={2}>Further reading</Heading>} hasDividers>
          <ListItem
            label="Getting started"
            description="The first wiki article, and the usual entry point for new cluster users."
            href="/wiki/getting-started"
          />
          <ListItem
            label="Classic HPC Wiki"
            description="The MediaWiki this site is modelled on."
            href="https://hpc-wiki.info/hpc/HPC_Wiki"
          />
        </List>
        <Text type="supporting">
          Questions about tone or structure belong next to the patch, not in a
          private channel. Open the files under{" "}
          <Link href="https://github.com/facebook/astryx" isExternalLink>
            Astryx
          </Link>{" "}
          if you are changing layout rather than prose.
        </Text>
      </VStack>
    </PageFrame>
  );
}
