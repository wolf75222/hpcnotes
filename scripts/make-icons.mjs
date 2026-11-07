// Regenerate favicon.ico, apple-icon.png and PWA icons from src/app/icon.svg:
//   node scripts/make-icons.mjs src/app/icon.svg src/app public
import fs from "node:fs";
import sharp from "sharp";
const [svgPath, appDir, publicDir] = process.argv.slice(2);
const svg = fs.readFileSync(svgPath);
// Full-bleed square for iOS / maskable (no rounded corners, padded mark).
const square = Buffer.from(svg.toString().replace('rx="7"', 'rx="0"'));
const png = (src, size) => sharp(src, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
fs.writeFileSync(`${appDir}/apple-icon.png`, await png(square, 180));
fs.writeFileSync(`${publicDir}/icon-192.png`, await png(svg, 192));
fs.writeFileSync(`${publicDir}/icon-512.png`, await png(svg, 512));
fs.writeFileSync(`${publicDir}/icon-maskable-512.png`, await png(square, 512));
// favicon.ico with PNG frames (16, 32, 48): header + directory + images.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((s) => png(svg, s)));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = Buffer.concat(frames.map((f, i) => {
  const e = Buffer.alloc(16); const s = sizes[i];
  e.writeUInt8(s % 256, 0); e.writeUInt8(s % 256, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(f.length, 8); e.writeUInt32LE(offset, 12); offset += f.length; return e;
}));
fs.writeFileSync(`${appDir}/favicon.ico`, Buffer.concat([header, dir, ...frames]));
console.log("icons written");
