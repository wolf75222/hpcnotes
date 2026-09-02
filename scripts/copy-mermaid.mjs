import fs from "node:fs";
import path from "node:path";

const src = path.join("node_modules", "mermaid", "dist", "mermaid.min.js");
const destDir = path.join("public", "vendor");
const dest = path.join(destDir, "mermaid.min.js");

if (!fs.existsSync(src)) {
  throw new Error(`Missing ${src}. Run npm install.`);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
