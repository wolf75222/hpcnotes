# HPC Wiki

A small blog of site-independent notes on high-performance computing. Same spirit as the classic [HPC Wiki](https://hpc-wiki.info/hpc/HPC_Wiki) — Slurm, MPI, GPUs, the habits that transfer between clusters — written as dated posts instead of a MediaWiki.

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

Posts live in `src/content/posts.ts`. Add an object to `POSTS` (slug, title, summary, ISO date, author, tags, Markdown body). The home page lists them newest first; `/[slug]` renders the body.

## Google AdSense

Copy `.env.example` to `.env.local` and fill in a client and slot IDs:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=
```

Without those values the site still runs; ad regions render as labelled placeholders so the layout stays stable. Do not click your own ads.

## Design system

Agent conventions live in `AGENTS.md`. Look up components with `npm run astryx -- component Button`.

## LinkedIn alumni collector

The Chrome extension for collecting Master CHPS alumni profiles is unchanged under `document/`.

## Stack

- Next.js (App Router) and React 19
- Astryx + StyleX tokens (pre-built CSS, no StyleX compiler)
- Optional Google AdSense
