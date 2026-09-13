import { MissingPost } from "@/components/missing-post";
import { notFoundMetadata } from "@/lib/page-metadata";

export const metadata = notFoundMetadata();

export default function NoteNotFound() {
  return <MissingPost />;
}
