import { readFileSync } from "fs";
import path from "path";
import { parse as parseFont, type Font } from "opentype.js";
import sharp from "sharp";

const CARD_WIDTH = 1080;
const PAD_X = 48;
const PAD_TOP = 40;
const PAD_BOTTOM = 44;
const MESSAGE_SIZE = 34;
const MESSAGE_LINE = 48;
const META_SIZE = 24;
const META_GAP = 28;
const PAPER = "#ffffff";
const INK = "#1d1d1d";
const MUTED = "#8a8680";
// Arimo is metrically compatible with Arial and safe to ship on Vercel
// (system Arial is not available in serverless).
const FONT_PATH = path.join(process.cwd(), "fonts", "Arimo-Regular.ttf");

let postcardFont: Font | null = null;

function getPostcardFont(): Font {
  if (!postcardFont) {
    const file = readFileSync(FONT_PATH);
    // Node Buffers share a larger ArrayBuffer; slice to the font bytes only.
    postcardFont = parseFont(
      file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength),
    );
  }
  return postcardFont;
}

/** Width of a string at a given size, measured from real glyph advances. */
function measureWidth(text: string, fontSize: number): number {
  const font = getPostcardFont();
  const scale = fontSize / font.unitsPerEm;
  let width = 0;
  for (const ch of text) {
    width += (font.charToGlyph(ch).advanceWidth || 0) * scale;
  }
  return width;
}

/**
 * Word-wrap using measured pixel widths so the rendered image breaks lines
 * at the same place the on-screen preview does (which wraps by real width).
 */
function wrapLines(text: string, maxWidth: number, fontSize: number): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines: string[] = [];
  for (const paragraph of normalized.split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }
    const words = paragraph.trim().split(/\s+/);
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (current && measureWidth(next, fontSize) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

/**
 * Prefer the client-provided label (already in the sender's timezone).
 * Only reformat bare YYYY-MM-DD, using UTC noon so the calendar day
 * does not shift on a UTC serverless host.
 */
function formatDateLabel(date: string): string {
  const value = date.trim();
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Outline text as SVG paths so Sharp/librsvg never needs system fonts.
 * Glyphs are laid out char-by-char to avoid OpenType features that
 * opentype.js cannot apply for some fonts (e.g. Noto Sans).
 */
function textPath(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fill: string,
  anchor: "start" | "end" = "start",
): string {
  const font = getPostcardFont();
  const value = text || " ";
  const scale = fontSize / font.unitsPerEm;

  let width = 0;
  for (const ch of value) {
    width += (font.charToGlyph(ch).advanceWidth || 0) * scale;
  }

  let cursor = anchor === "end" ? x - width : x;
  const chunks: string[] = [];
  for (const ch of value) {
    const glyph = font.charToGlyph(ch);
    const d = glyph.getPath(cursor, y, fontSize).toPathData(2);
    if (d) chunks.push(d);
    cursor += (glyph.advanceWidth || 0) * scale;
  }

  if (!chunks.length) return "";
  return `<path d="${chunks.join(" ")}" fill="${fill}"/>`;
}

export async function buildPostcardCardImage(options: {
  photoBase64: string;
  message: string;
  sender: string;
  location: string;
  date: string;
}): Promise<Buffer> {
  const photoBuffer = Buffer.from(options.photoBase64, "base64");
  const resized = await sharp(photoBuffer)
    .rotate()
    .resize({ width: CARD_WIDTH, withoutEnlargement: false })
    .jpeg({ quality: 90 })
    .toBuffer();

  const { height: photoHeight = CARD_WIDTH } = await sharp(resized).metadata();

  const messageLines = wrapLines(
    options.message || " ",
    CARD_WIDTH - PAD_X * 2,
    MESSAGE_SIZE,
  );
  const messageBlockHeight = Math.max(messageLines.length, 1) * MESSAGE_LINE;

  const dateLabel = formatDateLabel(options.date);
  const leftMeta = [dateLabel, options.location].filter(Boolean).join(" · ");
  const sender = options.sender.trim() || "A friend";

  const textTop = photoHeight + PAD_TOP;
  const metaY = textTop + messageBlockHeight + META_GAP + META_SIZE;
  const totalHeight = metaY + PAD_BOTTOM;

  const messageSvg = messageLines
    .map((line, index) => {
      const y = textTop + MESSAGE_SIZE + index * MESSAGE_LINE;
      return textPath(line || " ", PAD_X, y, MESSAGE_SIZE, INK);
    })
    .join("");

  const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CARD_WIDTH}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${PAPER}"/>
  ${messageSvg}
  ${textPath(leftMeta, PAD_X, metaY, META_SIZE, MUTED)}
  ${textPath(sender, CARD_WIDTH - PAD_X, metaY, META_SIZE, MUTED, "end")}
</svg>`);

  return sharp(overlay)
    .composite([{ input: resized, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
}
