export type ArenaBlogPostType = "dropdown" | "text" | "link";

export type ArenaBlogPost = {
  id: number;
  slug: string;
  image: string;
  alt: string;
  title?: string;
  summary: string;
  body: string;
  type: ArenaBlogPostType;
  isPublished: boolean;
  date: string;
  arenaUrl: string;
};
