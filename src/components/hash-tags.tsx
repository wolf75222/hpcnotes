import { Link } from "@astryxdesign/core/Link";
import { HStack } from "@astryxdesign/core/Stack";

export function HashTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <HStack gap={3} wrap="wrap">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          color="secondary"
          type="supporting"
          isStandalone
          className="note-tag"
        >
          #{tag}
        </Link>
      ))}
    </HStack>
  );
}
