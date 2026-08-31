export type WikiAudience = "basics" | "user" | "developer" | "admin";

export type TokenColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "gray";

export interface WikiAudienceMeta {
  id: WikiAudience;
  title: string;
  shortTitle: string;
  summary: string;
  href: string;
  tokenColor: TokenColor;
}

export interface WikiPage {
  slug: string;
  title: string;
  audience: WikiAudience;
  summary: string;
  updated: string;
  related: string[];
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  body: string;
}

export interface SearchHit {
  kind: "wiki" | "blog" | "page";
  id: string;
  title: string;
  href: string;
  group: string;
  description: string;
}
