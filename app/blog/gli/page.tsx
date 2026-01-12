import { getPostBySlug } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";

export default async function GliPage() {
  const post = getPostBySlug("gli");
  const processed = await remark().use(html).process(post.content);

  return (
    <article className="max-w-[65ch] flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl">{String(post.frontmatter.title)}</h1>
        <p className="text-sm opacity-60">{String(post.frontmatter.date)}</p>
      </header>

      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: processed.toString() }}
      />
    </article>
  );
}
