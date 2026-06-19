import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";
import toIco from "to-ico";

const publicDir = join(process.cwd(), "public");
const source = join(publicDir, "aegislore-logo.png");

const assets = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 }
];

const icoBuffers = [];

for (const asset of assets) {
  const buffer = await sharp(source)
    .resize(asset.size, asset.size, {
      fit: "cover",
      position: "centre"
    })
    .png()
    .toBuffer();

  writeFileSync(join(publicDir, asset.name), buffer);

  if (asset.size === 16 || asset.size === 32) {
    icoBuffers.push(buffer);
  }
}

const favicon = await toIco(icoBuffers);
writeFileSync(join(publicDir, "favicon.ico"), favicon);

console.log("Generated favicon assets in public/");
