# HPC Wiki

A modern **wiki and blog** for site-independent high-performance computing. Same job as the classic [HPC Wiki](https://hpc-wiki.info/hpc/HPC_Wiki) — Basics, Users, Developers, Admins — with a reading layout built on [Astryx](https://github.com/facebook/astryx) instead of MediaWiki.

The wiki is the durable map (login, modules, Slurm, MPI, GPUs, filesystems). The blog is dated notes and war stories. Advertising is optional: Google AdSense slots sit in the sidebar and in feeds, and fall back to labelled placeholders until you connect a publisher ID.

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

## Google AdSense

Copy `.env.example` to `.env.local` and fill in a client and slot IDs:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=
```

Without those values the site still runs; ad regions render as honest “Advertisement” placeholders so the layout stays stable. See [Contribute](/contribute) in the app for the full checklist. Do not click your own ads.

## Content

| Path | What it is |
| --- | --- |
| `src/content/wiki.ts` | Wiki articles (Markdown bodies, audience, related slugs) |
| `src/content/blog.ts` | Blog posts |
| `src/content/audiences.ts` | Basics / user / developer / admin |

Edits are pull requests. There is no in-browser wiki editor.

## Design system

UI is [Astryx](https://astryx.atmeta.com/docs/getting-started) (`@astryxdesign/core`) with a custom cool-blue **hpc** theme compiled from `src/theme/source.ts`:

```bash
npm run astryx -- theme build src/theme/source.ts -o src/theme/hpc.css
```

Agent conventions live in `AGENTS.md`. Look up components with `npm run astryx -- component Button`.

## LinkedIn alumni collector

The Chrome extension for collecting Master CHPS alumni profiles is unchanged under `document/`.

## Stack

- Next.js (App Router) and React 19
- Astryx + StyleX tokens (pre-built CSS, no StyleX compiler)
- Optional Google AdSense
