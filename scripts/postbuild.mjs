// Finish the static export in out/ for Cloudflare Pages:
// - /notes/<slug>.md files (Next exports the route handler at /notes/md/<slug>)
// - _headers: security headers + caching
// - _redirects: legacy URLs and /<slug> -> /notes/<slug>
import fs from "node:fs";
import path from "node:path";
import { LEGACY_REDIRECTS, securityHeaders } from "../site-rules.mjs";

const OUT = path.resolve("out");
if (!fs.existsSync(OUT)) {
  console.error("postbuild: out/ is missing; did `next build` run with output: export?");
  process.exit(1);
}

const NOTES = path.join(OUT, "notes");
const slugs = fs
  .readdirSync(NOTES)
  .filter((name) => name.endsWith(".html"))
  .map((name) => name.slice(0, -5))
  .filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));

// 1. Markdown copies at /notes/<slug>.md
const MD_DIR = path.join(NOTES, "md");
let copied = 0;
for (const slug of slugs) {
  const candidates = [path.join(MD_DIR, slug), path.join(MD_DIR, `${slug}.html`), path.join(MD_DIR, slug, "index.html")];
  const source = candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
  const target = path.join(NOTES, `${slug}.md`);
  if (source == null && fs.existsSync(target)) {
    copied += 1; // already done by an earlier run
    continue;
  }
  if (source == null) {
    console.warn(`postbuild: no Markdown export for ${slug}`);
    continue;
  }
  fs.copyFileSync(source, target);
  copied += 1;
}
fs.rmSync(MD_DIR, { recursive: true, force: true });

// 2. _headers
const security = securityHeaders({ dev: false })
  .map(({ key, value }) => `  ${key}: ${value}`)
  .join("\n");
const headers = `/*
${security}

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/notes/*.md
  Content-Type: text/markdown; charset=utf-8
  Link: </llms.txt>; rel="describedby"; type="text/markdown"

/llms.txt
  Content-Type: text/markdown; charset=utf-8

/llms-full.txt
  Content-Type: text/markdown; charset=utf-8

/feed.xml
  Content-Type: application/rss+xml; charset=utf-8

/search-index.json
  X-Robots-Tag: noindex

/opengraph-image
  Content-Type: image/png

/:a/opengraph-image
  Content-Type: image/png

/:a/:b/opengraph-image
  Content-Type: image/png
`;
fs.writeFileSync(path.join(OUT, "_headers"), headers);

// 3. _redirects (Cloudflare: first match wins)
const topLevel = new Set(
  fs.readdirSync(OUT).map((name) => name.replace(/\.(html|txt|xml|json)$/, "")),
);
// Static rules first: Cloudflare caps dynamic (placeholder/splat) rules at
// 100 and treats every rule after the first dynamic one as dynamic.
const rules = [
  ...LEGACY_REDIRECTS.map(([from, to]) => `${from} ${to} 301`),
  "/wiki/* / 301",
  ...slugs.filter((slug) => !topLevel.has(slug)).map((slug) => `/${slug} /notes/${slug} 301`),
];
const isDynamic = (rule) => /[:*]/.test(rule.split(" ")[0]);
const lines = [...rules.filter((rule) => !isDynamic(rule)), ...rules.filter(isDynamic)];
fs.writeFileSync(path.join(OUT, "_redirects"), `${lines.join("\n")}\n`);

console.log(
  `postbuild: ${copied} .md files, _headers, _redirects (${lines.length} rules)`,
);
