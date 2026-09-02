import { Heading, Text } from "@astryxdesign/core/Text";
import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/Stack";
import type { BlogPost } from "@/content/types";
import { formatMonthYear } from "@/lib/dates";

export function WritingList({
  posts,
  heading = "Writing",
}: {
  posts: BlogPost[];
  heading?: string;
}) {
  if (posts.length === 0) {
    return (
      <VStack gap={2}>
        <Heading level={2}>{heading}</Heading>
        <Text color="secondary">When a note ships, it will show up here.</Text>
      </VStack>
    );
  }

  return (
    <List
      header={
        <Text type="label" color="secondary">
          {heading}
        </Text>
      }
      hasDividers
      density="compact"
    >
      {posts.map((post) => (
        <ListItem
          key={post.slug}
          label={post.title}
          href={`/${post.slug}`}
          endContent={
            <Text type="supporting" textWrap="nowrap">
              {formatMonthYear(post.date)}
            </Text>
          }
        />
      ))}
    </List>
  );
}
