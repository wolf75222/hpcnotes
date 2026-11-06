// Build-time image pipeline (the static host has no image server):
// - public/media/*.png|jpg|jpeg -> public/media/_opt/<name>.avif + .webp
// - src/content/media-manifest.json: intrinsic width/height of every
//   image in public/media, so <img> reserves its box (no layout shift).
// Runs before dev and build; skips files that are already up to date.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MEDIA = path.resolve("public/media");
const OPT = path.join(MEDIA, "_opt");
const MANIFEST = path.resolve("src/content/media-manifest.json");
const RASTER = /\.(png|jpe?g)$/i;
const MEASURED = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const MAX_WIDTH = 1600;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "_opt" ? [] : walk(full);
    return [full];
  });
}

function fresh(target, source) {
  return fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs;
}

const manifest = {};
let written = 0;
fs.mkdirSync(OPT, { recursive: true });

for (const file of walk(MEDIA).filter((f) => MEASURED.test(f)).sort()) {
  const rel = `/media/${path.relative(MEDIA, file).split(path.sep).join("/")}`;
  const meta = await sharp(file, { animated: true }).metadata();
  const width = meta.width ?? 0;
  const height = meta.pageHeight ?? meta.height ?? 0;
  const entry = { width, height };

  if (RASTER.test(file)) {
    const base = path.relative(MEDIA, file).replace(RASTER, "").split(path.sep).join("__");
    const resize = width > MAX_WIDTH ? { width: MAX_WIDTH } : undefined;
    for (const [format, options] of [
      ["avif", { quality: 55, effort: 4 }],
      ["webp", { quality: 78 }],
    ]) {
      const target = path.join(OPT, `${base}.${format}`);
      if (!fresh(target, file)) {
        let pipeline = sharp(file);
        if (resize) pipeline = pipeline.resize(resize);
        await pipeline.toFormat(format, options).toFile(target);
        written += 1;
      }
      entry[format] = {
        src: `/media/_opt/${base}.${format}`,
        bytes: fs.statSync(target).size,
      };
    }
  }
  // Only keep a format when it beats the original file.
  for (const format of ["avif", "webp"]) {
    if (entry[format] && entry[format].bytes >= fs.statSync(file).size) {
      delete entry[format];
    }
  }
  manifest[rel] = entry;
}

const json = `${JSON.stringify(manifest, null, 2)}\n`;
if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== json) {
  fs.writeFileSync(MANIFEST, json);
}
console.log(`optimize-media: ${Object.keys(manifest).length} images, ${written} files written`);
