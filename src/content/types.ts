export type ContentKind = "thought" | "note";

export interface NoteIndex {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  draft: boolean;
  parent: string | null;
  order: number;
  kind: ContentKind;
}

export interface Note extends NoteIndex {
  body: string;
}

export interface Playlist {
  slug: string;
  title: string;
  summary: string;
  slugs: string[];
}

export interface ThoughtNode {
  note: NoteIndex;
  children: ThoughtNode[];
}

export interface ThoughtRef {
  slug: string;
  title: string;
  depth: number;
}
