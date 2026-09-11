import { PaperFrame } from "@/components/paper-frame";
import { getNoteIndex } from "@/content/load-notes";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <PaperFrame notes={getNoteIndex()}>{children}</PaperFrame>;
}
