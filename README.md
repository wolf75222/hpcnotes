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

Notes live in `src/content/notes.ts`. Add an object to `NOTES` (slug, title, summary, ISO date, author, tags, Markdown body). Playlists live in `src/content/playlists.ts` as ordered lists of slugs.

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
- Optional Google AdSense
