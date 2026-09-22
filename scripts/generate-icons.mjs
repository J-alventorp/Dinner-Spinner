import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const svgPath = path.join(__dirname, 'icon-source.svg');
const svg = readFileSync(svgPath);

const sizes = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(path.join(outDir, file));
  console.log('wrote', file);
}

// Maskable icon: pad the artwork into the center ~80% safe zone on the
// background color, since OS masks can crop up to ~20% from any edge.
const maskableSize = 512;
const safeContent = Math.round(maskableSize * 0.7);
const padded = await sharp(svg)
  .resize(safeContent, safeContent)
  .toBuffer();

await sharp({
  create: {
    width: maskableSize,
    height: maskableSize,
    channels: 4,
    background: '#FF6B35',
  },
})
  .composite([{ input: padded, gravity: 'center' }])
  .png()
  .toFile(path.join(outDir, 'icon-512-maskable.png'));
console.log('wrote icon-512-maskable.png');

// Favicon (32x32 PNG; referenced directly, no .ico conversion needed)
await sharp(svg).resize(32, 32).png().toFile(path.join(root, 'public', 'favicon.png'));
console.log('wrote favicon.png');

// Also drop the source SVG into public/icons for a scalable favicon option
writeFileSync(path.join(outDir, 'icon.svg'), svg);
console.log('wrote icon.svg');
