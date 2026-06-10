import InfoChip from "@/components/InfoChip";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import { MICROBLOG_INFO_TEXT } from "@/content/microblog";
import { getBlogFeed } from "@/lib/blog-feed";
import BlogItem from "./BlogItem";

export const revalidate = 3600;

type BlogPageProps = {
  searchParams?: Promise<{ filter?: string }>;
};

// --- MAIN PAGE ---
// Server Component that can filter posts via ?filter=links|all
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = await getBlogFeed();

  const params = searchParams ? await searchParams : {};
  const filter = params?.filter === "links" ? "links" : "all";

  const posts =
    filter === "links"
      ? allPosts.filter((post) => post.type === "link")
      : allPosts;

  return (
    <div className="min-h-screen background px-4 pb-12 pt-6">
      <ShootingStarCursor />
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-6">
          <InfoChip text={MICROBLOG_INFO_TEXT} placement="below" />
        </div>

        <div className="flex flex-col">
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post, index) => (
              <BlogItem key={post.slug} post={post} toneIndex={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}