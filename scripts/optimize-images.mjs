import sharp from "sharp";
import { globby } from "globby";
import path from "node:path";
import fs from "node:fs/promises";

const INPUT_DIR = "raw-images";
const OUTPUT_DIR = "public/images";

async function main() {
  const files = await globby([
    `${INPUT_DIR}/**/*.{jpg,jpeg,png}`,
  ]);

  if (files.length === 0) {
    console.log("No source images found in", INPUT_DIR);
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const file of files) {
    const rel = path.relative(INPUT_DIR, file);
    const outPath = path
      .join(OUTPUT_DIR, rel)
      .replace(/\.(png|jpg|jpeg)$/i, ".jpg");

    await fs.mkdir(path.dirname(outPath), { recursive: true });

    const buf = await sharp(file)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    await fs.writeFile(outPath, buf);
    console.log(`Optimized: ${file} → ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

