# hpcnotes.eu

Short notes on high-performance computing. A white page, a list, a date.

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

Press `/` or `⌘K` / `Ctrl+K`, or the search mark, to search in the page. Type a title, a `#tag`, or a few words. Escape closes it.

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
`public/media/`), and fenced code gets a copy button. Tags render as `#tag`
at the end of the note. Similar notes are listed under that.
```

| Route | What it is |
| --- | --- |
| `/` | Thoughts: intro, then every note |
| `/notes/[slug]` | A note. Long notes keep an in-column table of contents that stays at the top of the page while you scroll |
| `/explore` | All `#tags`, with counts |

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
