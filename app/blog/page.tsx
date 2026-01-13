import { getAllPosts } from "@/lib/posts";
import BlogItem from "./BlogItem";

// --- MAIN PAGE ---
// This is now a Server Component that fetches posts at build time
// Posts are read from markdown files in /content/posts using fs.readdirSync() and gray-matter
export default async function BlogPage() {
  
  // Determines if it has the isPublished flag set to true
  // Add 'await' if your library function is async
  const allPosts = await getAllPosts(); 
  const posts = getAllPosts().filter((post) => post.isPublished !== false);

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-md mx-auto">
        <header className="mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Blog
          </h1>
          <p className="text-gray-500">
            non-dated posts to log
          </p>
        </header>

        <div className="flex flex-col">
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <BlogItem key={post.slug} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}