import { fetchArenaBlogPosts } from "./arena";
import type { ArenaBlogPost } from "./arena-types";
import { getAllPosts, type BlogPost } from "./posts";

const DEFAULT_ARENA_CHANNEL = "gli-microblog";

function postTimestamp(date?: string): number {
  if (!date) return 0;
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => postTimestamp(b.date) - postTimestamp(a.date),
  );
}

function arenaPostToBlogPost(arena: ArenaBlogPost): BlogPost {
  return {
    slug: `arena-${arena.id}`,
    image: arena.image,
    alt: arena.alt,
    type: arena.type,
    isPublished: true,
    summary: arena.summary,
    body: arena.body,
    date: arena.date,
    description: arena.body,
  };
}

export async function getBlogFeed(): Promise<BlogPost[]> {
  const markdownPosts = getAllPosts().filter(
    (post) => post.isPublished !== false,
  );

  const channelSlug =
    process.env.ARENA_CHANNEL_SLUG?.trim() || DEFAULT_ARENA_CHANNEL;

  let arenaPosts: BlogPost[] = [];

  const fetchInit: RequestInit =
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { revalidate: 3600 } };

  try {
    const arena = await fetchArenaBlogPosts(channelSlug, {
      token: process.env.ARENA_ACCESS_TOKEN,
      fetchInit,
    });
    arenaPosts = arena.map(arenaPostToBlogPost);
  } catch (error) {
    console.error("[blog-feed] Failed to load Are.na posts:", error);
  }

  return sortPostsByDate([...markdownPosts, ...arenaPosts]);
}
