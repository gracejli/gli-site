import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import BlogItem from "./BlogItem";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

type BlogPageProps = {
  searchParams?: Promise<{ filter?: string }>;
};

// --- MAIN PAGE ---
// Server Component that can filter posts via ?filter=links|all
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = getAllPosts().filter((post) => post.isPublished !== false);

  const params = searchParams ? await searchParams : {};
  const filter = params?.filter === "links" ? "links" : "all";
  const isLinksView = filter === "links";

  const posts =
    filter === "links"
      ? allPosts.filter((post) => post.type === "link")
      : allPosts;

  return (
    <div className="min-h-screen background py-12 px-4">
      <ShootingStarCursor />
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-6">
          <Link
            href={isLinksView ? "/blog" : "/blog?filter=links"}
            className="text-xs uppercase tracking-wide underline underline-offset-4 hover:text-white transition-colors"
          >
            {isLinksView ? "view all" : "view links"}
          </Link>
        </div>

        <div className="flex flex-col">
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => <BlogItem key={post.slug} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}