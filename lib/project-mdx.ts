import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { projectMdxComponents } from "@/components/project-mdx-components";

const projectsDir = path.join(process.cwd(), "content/projects");

function safeProjectSegment(name: string) {
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    throw new Error(`Invalid project path segment: ${name}`);
  }
  return name;
}

export async function getProjectMdxContent(
  slug: string,
  filename = "content.mdx",
) {
  safeProjectSegment(slug);
  if (!filename.endsWith(".mdx") || filename.includes("/") || filename.includes("..")) {
    throw new Error(`Invalid MDX filename: ${filename}`);
  }
  const filePath = path.join(projectsDir, slug, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Project MDX not found: ${filePath}`);
  }
  const source = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
    components: projectMdxComponents,
  });
  return { content, frontmatter: frontmatter as Record<string, unknown> };
}
