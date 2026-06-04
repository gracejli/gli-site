import Link from "next/link";
import { getBlogFeed } from "@/lib/blog-feed";
import BlogItem from "@/app/blog/BlogItem";
import ProjectItem from "@/components/ProjectItem";
import {
  myArchivesCollections,
  documents,
  myHands,
  gliVsWorld,
  workProjectKey,
} from "@/content/projects/data";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

type AllPageProps = {
  searchParams?: Promise<{ filter?: string }>;
};

export const revalidate = 3600;

export default async function AllPage({ searchParams }: AllPageProps) {
  const allPosts = await getBlogFeed();

  const params = searchParams ? await searchParams : {};
  const filter = params?.filter === "links" ? "links" : "all";
  const isLinksView = filter === "links";
  const blogPosts =
    filter === "links"
      ? allPosts.filter((post) => post.type === "link")
      : allPosts;

  return (
    <div className="min-h-screen background py-12 px-4">
      <ShootingStarCursor />
      <div className="max-w-2xl mx-auto">
        <div className="space-y-24">
          {/* Projects Section */}
          <section>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-lg font-bold font-bianzhidai">projects</h2>
              <span className="text-sm font-fe font-bold opacity-70 italic">work</span>
            </div>
            <div>
              {(
                [
                  ["archives", myArchivesCollections],
                  ["hands", myHands],
                  ["gliVsWorld", gliVsWorld],
                  ["documentation", documents],
                ] as const
              ).flatMap(([section, items]) =>
                items.map((p) => (
                  <ProjectItem
                    key={workProjectKey(section, p.id)}
                    project={p}
                  />
                ))
              )}
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="pb-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold font-bianzhidai">blog posts</h2>
              <Link
                href={isLinksView ? "/all" : "/all?filter=links"}
                className="text-xs uppercase tracking-wide underline underline-offset-4 hover:text-white transition-colors"
              >
                {isLinksView ? "view all" : "view links"}
              </Link>
            </div>
            <div className="flex flex-col">
              {blogPosts.length === 0 ? (
                <p className="font-fe font-bold opacity-70">No posts yet.</p>
              ) : (
                blogPosts.map((post, index) => (
                  <BlogItem key={post.slug} post={post} toneIndex={index} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
