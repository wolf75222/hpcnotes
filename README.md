# hpcnotes.eu

Private notes site for [hpcnotes.eu](https://hpcnotes.eu): short notes on high-performance computing, and personal thoughts around HPC. A white page, a list, a date.

This repository is meant to stay **private**. It holds the Next.js site, the Markdown notes, and a separate Chrome extension under `document/`.

## Requirements

- Node.js 20 or newer
- npm (comes with Node)

## Run locally

```bash
git clone <this-repo-url>
cd hpcnotes
npm install
npm run dev
```

The app listens on [http://127.0.0.1:43123](http://127.0.0.1:43123). Press `/` or `⌘K` / `Ctrl+K`, or the search mark, to search in the page. Type a title, a `#tag`, or a few words. Escape closes it. Search looks at titles, summaries, and tags — not the full note body.

Production build:

```bash
npm run build
npm start
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 43123 |
| `npm run build` | Production build |
| `npm start` | Serve the production build on 43123 |
| `npm run new -- my-note-slug` | Scaffold a draft Markdown note |
| `npm run lint` | ESLint |

## Repository layout

```
src/content/notes/     Markdown notes (filename = URL slug)
src/content/           Loaders, thought tree, search index
src/app/               Next.js App Router pages and RSS
src/components/        Paper UI
public/media/          Images and gifs referenced as /media/…
document/              Chrome extension (Master CHPS alumni collector)
```

## Write a note

```bash
npm run new -- my-note-slug
```

That scaffolds `src/content/notes/my-note-slug.md` with today’s date and `draft: true`. The filename is the slug (`what-a-note-can-carry.md` → `/notes/what-a-note-can-carry`).

```md
---
title: What a note can carry
summary: One line for the list.
date: 2026-09-02
author: hpcnotes
tags: documentation, gpu
draft: false
---

Write ordinary Markdown: headings, lists, tables, quotes, [links](/notes/…),
images, gifs, mermaid, and maths. A `mermaid` fence is a diagram, `$…$` or a
`math` fence is KaTeX, `![alt](/media/file.gif)` is a local figure (files live
in `public/media/`), `![alt](https://…/file.png)` is a remote raster image, and
fenced code gets a copy button. Tags render as `#tag` at the end of the note.
Similar notes are listed under that.
```

| Field | Notes |
| --- | --- |
| `title` | Required. Shown on the home list and the article. |
| `summary` | One line for search and similar-note cards. |
| `date` | `YYYY-MM-DD`. Invalid dates render as `—`. |
| `tags` | Comma list (`mpi, slurm`) or brackets (`[mpi, slurm]`). |
| `draft` | `true` / `yes` / `1` hides the note in production. Visible in `npm run dev`. |
| `kind` | `note` for a multi-page document, `thought` for a short article. Children of a note are pages. |
| `parent` | Slug of the parent note. Omit on a root. |
| `order` | Integer used to order sibling pages under the same parent. |

A **note** is a document that can span several pages. Set `kind: note` on the root, then `parent` and `order` on each page:

```md
---
title: Anatomy of a Slurm job that actually finishes
date: 2026-08-11
parent: working-on-a-cluster
order: 3
tags: slurm, batch
---
```

A **thought** is a short standalone article (`kind: thought`, the default).

The home list shows notes and thoughts as two groups. Child pages stay inside their parent note. Nested contents start collapsed: a chevron unrolls a section in place (the title still opens the page). Numbers, Next, and Previous are the same destination as the title; the dotted leaders are not links. A page inside a note has a Start row back to the cover, and small start / previous / next marks by the date. Previous and Next also stay as named leader rows. The HPC note is the nested example.

A broken Markdown file fails `npm run build`. In `npm run dev` it is skipped with a warning.

Local images and videos must be paths under `/media/…`. HTTPS raster images
(`.png`, `.jpg`, `.gif`, `.webp`) and videos (`.mp4`, `.webm`) are also
rendered. Remote SVG, `javascript:` URLs, and anything that leaves `/media/`
on disk are not.

| Route | What it is |
| --- | --- |
| `/` | Intro, then notes, then thoughts. Pages of a note live inside their parent |
| `/notes/[slug]` | A page. Nested contents unroll with a chevron; numbers, Next / Previous, and start / previous / next marks turn the note |
| `/explore` | `#tags` on listed notes (covers and standalone thoughts), with counts |
| `/feed.xml` | RSS of published covers and thoughts, not every child page |
| `/sitemap.xml` | Published notes, explore, tags, and years |
| `/robots.txt` | Allow all, with a pointer to the sitemap |
| `/opengraph-image` | Default share image. Each note also has its own |
| `/llms.txt` | Index of notes for language models, with `.md` links |
| `/llms-full.txt` | Every published note as one Markdown file |
| `/notes/[slug].md` | Raw Markdown for that note. `Accept: text/markdown` on the HTML URL also works |
| unmatched URL | 404. Missing `/notes/…` slugs say the note is not here. A render failure shows Try again |

## Environment

Copy `.env.example` to `.env.local`. None of these are required to run the site.

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=
NEXT_PUBLIC_SITE_URL=https://hpcnotes.eu
GOOGLE_SITE_VERIFICATION=
```

Without the AdSense values the site still runs and ad regions stay hidden. Do not click your own ads. `NEXT_PUBLIC_SITE_URL` should be the public origin so RSS, sitemap, and Open Graph URLs are absolute. `GOOGLE_SITE_VERIFICATION` is optional (Search Console HTML-tag method).

## Hosting

Push this private repository to [Vercel](https://vercel.com) and import it with a GitHub connection that can read private repos. The default Node runtime is enough. Set `NEXT_PUBLIC_SITE_URL` to the public origin (`https://hpcnotes.eu`). After the first production deploy, submit `https://hpcnotes.eu/sitemap.xml` in Google Search Console. Language-model crawlers can use `https://hpcnotes.eu/llms.txt`. Point the apex and `www` at Vercel, with `www` redirecting to the apex.

## Design system

The UI is [Astryx](https://github.com/facebook/astryx) with the **neutral** theme, locked to light mode. Agent conventions live in `AGENTS.md`. Look up components with `npm run astryx -- component Button`.

## LinkedIn alumni collector

The Chrome extension for collecting Master CHPS alumni profiles is unchanged under `document/`. See `document/GUIDE_RAPIDE.md` and `document/CHECKLIST.md`.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Astryx + StyleX tokens (pre-built CSS, no StyleX compiler)
- KaTeX for maths, Mermaid for diagrams (the browser bundle is copied to `public/vendor/` on install)
- Optional Google AdSense
