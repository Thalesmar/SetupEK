import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve('public/assets');
const skipNames = new Set(['vite.svg', 'download.svg']);

const maxWidths = [
  { match: /brands[\\/]brands-logo/i, width: 256 },
  { match: /hot-deals|new-arrival/i, width: 800 },
  { match: /top-categories/i, width: 640 },
  { match: /brands[\\/]brands-banner/i, width: 1200 },
  { match: /discount-slide/i, width: 1200 },
  { match: /best-setups/i, width: 1000 },
  { match: /\.(png|jpe?g|webp)$/i, width: 1200 },
];

function getMaxWidth(filePath) {
  for (const rule of maxWidths) {
    if (rule.match.test(filePath)) return rule.width;
  }
  return 1200;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return;

  const before = fs.statSync(filePath).size;
  if (before < 80 * 1024) return;

  const maxWidth = getMaxWidth(filePath);
  const image = sharp(filePath).resize({
    width: maxWidth,
    withoutEnlargement: true,
  });

  let buffer;
  if (ext === '.png') {
    buffer = await image
      .png({ quality: 80, compressionLevel: 9, effort: 10 })
      .toBuffer();
  } else if (ext === '.webp') {
    buffer = await image.webp({ quality: 78 }).toBuffer();
  } else {
    buffer = await image.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  }

  const after = buffer.length;
  if (after < before) {
    fs.writeFileSync(filePath, buffer);
    console.log(
      `${path.relative(assetsDir, filePath)}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`
    );
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (skipNames.has(entry.name) || entry.name.endsWith('.opt')) continue;
    files.push(fullPath);
  }
}

const files = [];
walk(assetsDir);

for (const file of files) {
  try {
    await optimizeFile(file);
  } catch (error) {
    console.error(`Skipped ${path.relative(assetsDir, file)}: ${error.message}`);
  }
}
