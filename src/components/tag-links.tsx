import { Token } from "@astryxdesign/core/Token";
import { HStack } from "@astryxdesign/core/Stack";

export function TagLinks({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <HStack gap={1} wrap="wrap">
      {tags.map((tag) => (
        <Token
          key={tag}
          label={tag}
          size="sm"
          color="default"
          href={`/tags/${encodeURIComponent(tag)}`}
        />
      ))}
    </HStack>
  );
}
