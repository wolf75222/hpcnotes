export interface NoteIndex {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  draft: boolean;
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
