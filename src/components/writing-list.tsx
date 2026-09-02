import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import type { BlogPost } from "@/content/types";
import { formatDayMonth } from "@/lib/dates";

export function WritingList({
  posts,
  heading,
}: {
  posts: BlogPost[];
  heading?: string;
}) {
  if (posts.length === 0) {
    return (
      <VStack gap={2}>
        {heading ? <Heading level={2}>{heading}</Heading> : null}
        <Text color="secondary">When a note ships, it will show up here.</Text>
      </VStack>
    );
  }

  return (
    <List
      header={
        heading ? (
          <Text type="label" color="secondary">
            {heading}
          </Text>
        ) : (
          <Text type="label" color="secondary">
            Writing
          </Text>
        )
      }
      density="spacious"
    >
      {posts.map((post) => (
        <ListItem
          key={post.slug}
          label={post.title}
          description={<Text color="secondary">{post.summary}</Text>}
          href={`/${post.slug}`}
          startContent={
            <Text type="supporting" textWrap="nowrap" hasTabularNumbers>
              {formatDayMonth(post.date)}
            </Text>
          }
        />
      ))}
    </List>
  );
}
