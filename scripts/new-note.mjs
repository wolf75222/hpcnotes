#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2]?.trim() ?? "";
if (slug === "") {
  console.error("Usage: npm run new -- my-note-slug");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Slug must be lowercase letters, numbers, and hyphens.");
  process.exit(1);
}

const dest = path.join("src/content/notes", `${slug}.md`);
if (fs.existsSync(dest)) {
  console.error(`Already exists: ${dest}`);
  process.exit(1);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const title = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(
  dest,
  `---
title: ${title}
date: ${today}
kind: thought
parent:
order:
tags:
summary:
draft: true
---

`,
);
console.log(`Created ${dest}`);
