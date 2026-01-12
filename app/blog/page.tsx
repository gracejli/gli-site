import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-16">
      {posts.map((p) => (
        <Link
          key={p.slug}
          href={`/blog/${p.slug}`}
          className="flex flex-col gap-2 max-w-[50ch]"
        >
          <div className="text-sm opacity-60">{p.date}</div>
          <div className="underline underline-offset-4">{p.title}</div>
          {p.description ? <div className="opacity-80">{p.description}</div> : null}
        </Link>
      ))}
    </div>
  );
}
