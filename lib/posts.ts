import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

export interface BlogPost {
  slug: string;
  image?: string;
  alt?: string; 
  type?: 'link' | 'dropdown' | 'text';
  isPublished?: boolean; 
  summary: string;
  url?: string;
  body?: string;
  title?: string;
  date?: string;
  description?: string;
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDir);

  return files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(postsDir, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);

      // Determine type based on frontmatter or default to 'dropdown'
      const type = (data.type as 'link' | 'dropdown' | 'text') || 'dropdown';
      
      return {
        slug,
        title: (data.title as string) || "",
        date: (data.date as string) || "",
        alt: (data.alt as string) || "",
        isPublished: (data.isPublished as boolean) || true,
        description: (data.description as string) || "",
        summary: (data.summary as string) || (data.description as string) || (data.title as string) || "",
        image: (data.image as string) || "",
        type: type,
        url: (data.url as string) || (type === 'link' ? `/${slug}` : undefined),
        body: (type === 'dropdown' || type === 'text') ? (content.trim() || (data.body as string) || "") : undefined,
      };
    })
    .sort((a, b) => {
      // Sort by date if available, otherwise by slug
      if (a.date && b.date) {
        return a.date < b.date ? 1 : -1;
      }
      return a.slug.localeCompare(b.slug);
    });
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, content };
}
