import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

let cachedNouns: string[] | null = null;

function loadNouns(): string[] {
  if (cachedNouns) return cachedNouns;
  const filePath = join(process.cwd(), "data", "finterest-nouns.txt");
  const content = readFileSync(filePath, "utf-8");
  cachedNouns = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return cachedNouns;
}

export async function GET() {
  const nouns = loadNouns();
  if (nouns.length === 0) {
    return NextResponse.json({ error: "No nouns available" }, { status: 500 });
  }
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return NextResponse.json({ noun });
}
