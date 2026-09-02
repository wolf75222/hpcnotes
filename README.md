# hpcnotes.eu

Short notes on high-performance computing. Site-independent, dated, and meant to sit beside a centre handbook — not replace it.

The UI is [Astryx](https://github.com/facebook/astryx) with the **neutral** theme, locked to light mode.

## Run locally

```bash
npm install
npm run dev
```

The app listens on [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm start
```

## Content

Notes are Markdown files in `src/content/notes/`. The filename is the slug (`what-a-note-can-carry.md` → `/notes/what-a-note-can-carry`). Front matter:

```md
---
title: What a note can carry
summary: One line for the list.
date: 2026-09-02
author: hpcnotes
tags: documentation, gpu
---

Write ordinary Markdown. A `mermaid` fence is a diagram, `$…$` or a `math`
fence is KaTeX, `![alt](/media/file.gif)` is a figure or gif (files live in
`public/media/`), and fenced code gets a copy button. Playlists are still
`src/content/playlists.ts` (ordered lists of slugs).
```

| Route | What it is |
| --- | --- |
| `/` | All notes, grouped by year |
| `/notes/[slug]` | A note, with a table of contents when the body has headings |
| `/tags`, `/tags/[tag]` | Tag index and a filtered list |
| `/playlists`, `/playlists/[slug]` | Ordered reading lists |
| `/years`, `/years/[year]` | Archive by date |
| `/search` | Live search over titles, tags, bodies, and playlist names |
| `/about` | What this site is |

## Google AdSense

Copy `.env.example` to `.env.local` and fill in a client and slot IDs:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=
```

Without those values the site still runs and ad regions stay hidden. Do not click your own ads.

## Design system

Agent conventions live in `AGENTS.md`. Look up components with `npm run astryx -- component Button`.

## LinkedIn alumni collector

The Chrome extension for collecting Master CHPS alumni profiles is unchanged under `document/`.

## Stack

- Next.js (App Router) and React 19
- Astryx + StyleX tokens (pre-built CSS, no StyleX compiler)
- KaTeX for maths, Mermaid for diagrams (the browser bundle is copied to `public/vendor/` on install)
- Optional Google AdSense
