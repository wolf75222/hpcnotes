import { Link } from "@astryxdesign/core/Link";
import { HStack } from "@astryxdesign/core/Stack";

export function TagLinks({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <HStack gap={2} wrap="wrap">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          color="secondary"
          size="sm"
          isStandalone
        >
          {tag}
        </Link>
      ))}
    </HStack>
  );
}
