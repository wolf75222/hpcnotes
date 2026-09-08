# hpcnotes.eu

Short notes on high-performance computing, and personal thoughts around HPC. A white page, a list, a date.

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

Press `/` or `⌘K` / `Ctrl+K`, or the search mark, to search in the page. Type a title, a `#tag`, or a few words. Escape closes it. Search looks at titles, summaries, and tags — not the full note body.

## Write a note

```bash
npm run new -- my-note-slug
```

That scaffolds `src/content/notes/my-note-slug.md` with today’s date and `draft: true`. The filename is the slug (`what-a-note-can-carry.md` → `/notes/what-a-note-can-carry`). Front matter:

```md
---
title: What a note can carry
summary: One line for the list.
date: 2026-09-02
author: hpcnotes
tags: documentation, gpu
draft: false
---

Write ordinary Markdown. A `mermaid` fence is a diagram, `$…$` or a `math`
fence is KaTeX, `![alt](/media/file.gif)` is a figure or gif (files live in
`public/media/`), and fenced code gets a copy button. Tags render as `#tag`
at the end of the note. Similar notes are listed under that.
```

`tags` may be a comma list (`mpi, slurm`) or a bracket list (`[mpi, slurm]`). Dates must be `YYYY-MM-DD`.

A thought can split into smaller notes. Set `parent` to the parent slug and `order` to keep children in a fixed sequence:

```md
---
title: Anatomy of a Slurm job that actually finishes
date: 2026-08-11
parent: working-on-a-cluster
order: 3
tags: slurm, batch
---
```

The home list nests those children under the parent. Opening a parent lists them after the note. On a wide screen, hover the left edge of the window for the same tree, plus in-page headings when a note has enough of them.

`draft: true` (also `yes` / `1`) keeps the note out of the production list, tag pages, search, and the RSS feed. In `npm run dev` drafts stay visible so you can preview them. A broken Markdown file is skipped with a warning; it does not fail the build.

Images and videos must be paths under `/media/…`. Remote URLs and anything that leaves that folder are not rendered.

| Route | What it is |
| --- | --- |
| `/` | Intro, then published notes. A parent thought lists its children underneath |
| `/notes/[slug]` | A note. Hover the left edge on a wide screen for the thought tree and, when the note is long, its headings |
| `/explore` | All `#tags`, with counts |
| `/feed.xml` | RSS of published notes |

## Hosting

Push the git repository to [Vercel](https://vercel.com). The default Node runtime is enough. Set `NEXT_PUBLIC_SITE_URL` to the public origin so feed links are absolute.

## Google AdSense

Copy `.env.example` to `.env.local` and fill in a client and slot IDs:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=
NEXT_PUBLIC_SITE_URL=https://hpcnotes.eu
```

Without those AdSense values the site still runs and ad regions stay hidden. Do not click your own ads.

## Design system

Agent conventions live in `AGENTS.md`. Look up components with `npm run astryx -- component Button`.

## LinkedIn alumni collector

The Chrome extension for collecting Master CHPS alumni profiles is unchanged under `document/`.

## Stack

- Next.js (App Router) and React 19
- Astryx + StyleX tokens (pre-built CSS, no StyleX compiler)
- KaTeX for maths, Mermaid for diagrams (the browser bundle is copied to `public/vendor/` on install)
- Optional Google AdSense
