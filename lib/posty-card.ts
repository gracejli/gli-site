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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Rough wrap for SVG text — assumes ~0.52em average char width at this size. */
function wrapLines(text: string, maxChars: number): string[] {
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
      if (next.length > maxChars && current) {
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

function formatDateLabel(date: string): string {
  if (!date) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  const maxChars = Math.floor((CARD_WIDTH - PAD_X * 2) / (MESSAGE_SIZE * 0.52));
  const messageLines = wrapLines(options.message || " ", maxChars);
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
      return `<text x="${PAD_X}" y="${y}" fill="${INK}" font-size="${MESSAGE_SIZE}" font-family="Arial, Helvetica, sans-serif">${escapeXml(line || " ")}</text>`;
    })
    .join("");

  const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${CARD_WIDTH}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${PAPER}"/>
  ${messageSvg}
  <text x="${PAD_X}" y="${metaY}" fill="${MUTED}" font-size="${META_SIZE}" font-family="Arial, Helvetica, sans-serif">${escapeXml(leftMeta)}</text>
  <text x="${CARD_WIDTH - PAD_X}" y="${metaY}" fill="${MUTED}" font-size="${META_SIZE}" font-family="Arial, Helvetica, sans-serif" text-anchor="end">${escapeXml(sender)}</text>
</svg>`);

  return sharp(overlay)
    .composite([{ input: resized, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
}
