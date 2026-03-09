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
  date?: string;
  description?: string;
}

export function getAllPosts(): BlogPost[] {
  // Safety check: ensure the directory exists before trying to read it
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir);

  return files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(postsDir, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);

      // --- KEY CHANGE HERE ---
      // 1. Prefer the 'slug' defined in frontmatter.
      // 2. Fallback to filename (removing .md) if no slug is provided.
      // Note: We remove leading slashes from data.slug to ensure consistency if user types "/my-slug"
      const rawSlug = (data.slug as string) || filename.replace(/\.md$/, "");
      const slug = rawSlug.startsWith('/') ? rawSlug.slice(1) : rawSlug;

      // Determine type based on frontmatter or default to 'dropdown'
      const type = (data.type as 'link' | 'dropdown' | 'text') || 'dropdown';

      return {
        slug,
        date: (data.date as string) || "",
        alt: (data.alt as string) || "",
        isPublished: data.isPublished !== false,
        description: (data.description as string) || "",
        summary: (data.summary as string) || (data.description as string) || (data.title as string) || "",
        image: (data.image as string) || "",
        type: type,
        
        // --- URL handling ---
        // 1. If 'url' is explicitly in frontmatter, use it exactly as is.
        // 2. If type is 'link', default to `/blog/${slug}` so link-style posts
        //    automatically point at their dynamic slug page under /blog/[slug].
        // 3. Otherwise undefined.
        url: (data.url as string) || (type === 'link' ? `/blog/${slug}` : undefined),
        
        // Logic for Body:
        // Return body for dropdown/text types OR if it's a link (so the destination page can render it)
        body: content.trim() || (data.body as string) || "",
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
  // Note: Finding a file by "custom slug" is trickier because we don't know the filename.
  // We have to iterate all files to find the one matching the slug.
  const allPosts = getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);
  
  if (!post) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  return { 
    slug: post.slug, 
    frontmatter: post, 
    content: post.body || "" 
  };
}