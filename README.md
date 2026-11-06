# hpcnotes

![hpcnotes home](docs/home.png)

Short notes on high-performance computing. Source of [hpcnotes.eu](https://hpcnotes.eu).

## Run

```bash
npm install
npm run dev        # http://127.0.0.1:43123
```

| Script | |
| --- | --- |
| `npm run build` | Static export to `out/` (+ `_headers`, `_redirects`) |
| `npm start` | Serve `out/` like Cloudflare Pages (wrangler) |
| `npm run new -- my-slug` | New draft note |
| `npm run check` | Lint, typecheck, tests (incl. broken links and missing media) |

## Write

Notes live in `src/content/notes/<slug>.md`:

~~~md
---
title: Login nodes are not compute
date: 2026-09-02
updated: 2026-10-01            # optional
summary: One line for lists and search.
tags: slurm, etiquette
kind: note                     # or thought (default)
parent: working-on-a-cluster   # optional: makes this a page of that note
order: 1
draft: false
---

Markdown, $math$, mermaid fences, ![figures](/media/x.png),
and links to [[other-note]] or [[other-note|a label]].
~~~

Media go in `public/media/`; PNG/JPEG get AVIF/WebP copies and their size at build time. Drafts only show in `npm run dev`.

## Layout

```
src/content/      notes, loaders, search
src/app/          routes, RSS, sitemap, llms.txt
src/components/   UI (Astryx)
```

## Deploy (Cloudflare Pages, free)

Cloudflare dashboard → Workers & Pages → Create → Pages → connect this repo.
Build command `npm run build`, output directory `out`, env `NODE_VERSION=22`
and `NEXT_PUBLIC_SITE_URL=https://<your-domain>`. Then add the custom domain.
Every push to `main` redeploys.

## Services (all free)

| Service | Plan | Can it bill? |
| --- | --- | --- |
| Cloudflare Pages, DNS, Web Analytics | Free | No payment method on file; Free plans stop at their limits instead of charging. Never add a card. |
| Pages Function `/api/report` (CSP + JS error logs) | Workers Free, 100k req/day | Over the limit requests fail, nothing is billed. Only `/api/*` runs code (`_routes.json`). |
| GitHub repo, Actions, Discussions (giscus comments) | Free (public repo) | No. |
| Google Search Console | Free | No. |
| Domain `hpcnotes.eu` | Hostinger | The only cost: yearly renewal. |

Observability: Cloudflare Web Analytics (traffic, Core Web Vitals, no cookies),
Functions real-time logs for `/api/report`, and `.github/workflows/monitor.yml`
(uptime, crawler access, headers, certificate, DNSSEC every 6 h; a failure
emails the repo owner).

## Environment

All optional, see `.env.example`: `NEXT_PUBLIC_SITE_URL`, AdSense IDs, `GOOGLE_SITE_VERIFICATION`.
