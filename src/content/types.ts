export interface Note {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  body: string;
}

export interface Playlist {
  slug: string;
  title: string;
  summary: string;
  slugs: string[];
}
