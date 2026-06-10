import type { ArenaBlogPost, ArenaBlogPostType } from "./arena-types";

const API_BASE = "https://api.are.na/v3";

type ArenaDescription =
  | string
  | { plain?: string; html?: string; markdown?: string }
  | null
  | undefined;

type ArenaV3BlockRaw = {
  id: number;
  type?: string;
  title?: string | null;
  alt_text?: string | null;
  description?: ArenaDescription;
  image?: {
    alt_text?: string | null;
    src?: string;
    small?: { src?: string };
    medium?: { src?: string };
    large?: { src?: string };
  };
  connection?: { connected_at?: string };
  created_at?: string;
};

type ArenaV3ContentsResponse = {
  data?: ArenaV3BlockRaw[];
};

export type FetchArenaOptions = {
  token?: string;
  per?: number;
  fetchInit?: RequestInit;
};

function descriptionMarkdown(description: ArenaDescription): string {
  if (description == null) return "";
  if (typeof description === "string") return description;
  return description.markdown ?? description.plain ?? "";
}

function firstLine(text: string): string {
  const line = text.split("\n").find((l) => l.trim());
  return line?.trim() ?? "";
}

const ARENA_TYPE_LINE = /^type:\s*(dropdown|text|link)\s*$/i;

/** Strip an optional `type: dropdown|text|link` directive from the first non-empty line. */
export function parseArenaDescription(raw: string): {
  type: ArenaBlogPostType;
  body: string;
} {
  const lines = raw.split("\n");
  let type: ArenaBlogPostType = "dropdown";
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const match = trimmed.match(ARENA_TYPE_LINE);
    if (match) {
      type = match[1].toLowerCase() as ArenaBlogPostType;
      bodyStart = i + 1;
    }
    break;
  }

  return { type, body: lines.slice(bodyStart).join("\n").trim() };
}

function normalizeImageBlock(raw: ArenaV3BlockRaw): ArenaBlogPost | null {
  const img = raw.image;
  if (!img?.src) return null;

  const { type, body } = parseArenaDescription(
    descriptionMarkdown(raw.description),
  );
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : undefined;
  const summary = title ?? firstLine(body) ?? "Untitled";

  const imageUrl =
    img.medium?.src ?? img.small?.src ?? img.large?.src ?? img.src;

  const alt = raw.alt_text?.trim() ?? img.alt_text?.trim() ?? "";

  return {
    id: raw.id,
    slug: String(raw.id),
    image: imageUrl,
    alt,
    title,
    summary,
    body,
    type,
    date: raw.connection?.connected_at ?? raw.created_at ?? "",
    arenaUrl: `https://www.are.na/block/${raw.id}`,
  };
}

function channelSlugForApi(channelSlug: string): string {
  const clean = channelSlug.replace(/^\//, "").trim();
  // Are.na URLs are /username/channel-slug but the API uses channel slug only.
  if (clean.includes("/")) {
    return clean.split("/").pop() ?? clean;
  }
  return clean;
}

export async function fetchArenaBlogPosts(
  channelSlug: string,
  options: FetchArenaOptions = {},
): Promise<ArenaBlogPost[]> {
  const cleanSlug = channelSlugForApi(channelSlug);
  if (!cleanSlug) {
    throw new Error("ARENA_CHANNEL_SLUG is required (e.g. my-microblog)");
  }

  const per = Math.min(options.per ?? 100, 100);
  const enc = encodeURIComponent(cleanSlug);
  const headers: HeadersInit = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const url = `${API_BASE}/channels/${enc}/contents?per=${per}&type=Image&sort=created_at_desc`;

  const res = await fetch(url, {
    ...options.fetchInit,
    headers: {
      ...headers,
      ...(options.fetchInit?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `Are.na API error (${res.status}): failed to load channel "${cleanSlug}"`,
    );
  }

  const json = (await res.json()) as ArenaV3ContentsResponse;
  const blocks = json.data ?? [];

  return blocks
    .map(normalizeImageBlock)
    .filter((post): post is ArenaBlogPost => post != null);
}
