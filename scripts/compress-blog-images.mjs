import sharp from "sharp";
import { globby } from "globby";
import fs from "node:fs/promises";
import path from "node:path";

const BLOG_DIR = "public/images/blog";
const MAX_EDGE = 1600;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const SKIP_UNDER_KB = 50;

async function compressFile(file) {
  const original = await fs.readFile(file);
  const originalKb = original.length / 1024;
  if (originalKb < SKIP_UNDER_KB) {
    return { file, skipped: "already small", originalKb, outKb: originalKb };
  }

  const image = sharp(original, { failOn: "none" }).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  const meta = await sharp(original, { failOn: "none" }).metadata();
  const ext = path.extname(file).toLowerCase();
  const isJpeg = ext === ".jpg" || ext === ".jpeg" || meta.format === "jpeg";

  const outBuf = isJpeg
    ? await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
    : await image
        .png({
          compressionLevel: 9,
          palette: true,
          quality: PNG_QUALITY,
          effort: 10,
          dither: 1,
        })
        .toBuffer();

  const outKb = outBuf.length / 1024;
  if (outBuf.length >= original.length) {
    return { file, skipped: "no smaller", originalKb, outKb: originalKb };
  }

  await fs.writeFile(file, outBuf);
  return { file, skipped: null, originalKb, outKb };
}

async function main() {
  const files = await globby([`${BLOG_DIR}/**/*.{jpg,jpeg,png}`]);
  if (files.length === 0) {
    console.log("No blog images found in", BLOG_DIR);
    return;
  }

  let savedKb = 0;
  for (const file of files.sort()) {
    const result = await compressFile(file);
    const name = path.relative(BLOG_DIR, result.file);
    if (result.skipped) {
      console.log(
        `skip ${name} (${result.originalKb.toFixed(0)}KB, ${result.skipped})`,
      );
      continue;
    }
    const saved = result.originalKb - result.outKb;
    savedKb += saved;
    console.log(
      `ok   ${name}  ${result.originalKb.toFixed(0)}KB → ${result.outKb.toFixed(0)}KB  (−${saved.toFixed(0)}KB)`,
    );
  }
  console.log(`\nSaved ${(savedKb / 1024).toFixed(1)}MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
