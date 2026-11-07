import { PaperFrame } from "@/components/paper-frame";
import type { NavItem, SiteNavData } from "@/components/site-nav";
import { getNoteIndex, getThoughtForest } from "@/content/load-notes";
import { isNoteDocument } from "@/content/thoughts";
import type { ThoughtNode } from "@/content/types";

function toNavItem(node: ThoughtNode): NavItem {
  return {
    slug: node.note.slug,
    title: node.note.title,
    children: node.children.map(toNavItem),
  };
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const forest = getThoughtForest();
  const nav: SiteNavData = {
    notes: forest.filter(isNoteDocument).map(toNavItem),
    thoughts: forest.filter((node) => !isNoteDocument(node)).map(toNavItem),
  };
  return (
    <PaperFrame notes={getNoteIndex()} nav={nav}>
      {children}
    </PaperFrame>
  );
}
