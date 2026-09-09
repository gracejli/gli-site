import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isRecommended, parseGenres, type Book } from "./books";

const booksDir = path.join(process.cwd(), "content/library/books");

function toDateRead(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return "";
}

export function getBooks(): Book[] {
  if (!fs.existsSync(booksDir)) {
    return [];
  }

  const files = fs.readdirSync(booksDir).filter((file) => file.endsWith(".md"));

  const books = files.map((filename) => {
    const filePath = path.join(booksDir, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    const book: Book = {
      slug: filename.replace(/\.md$/, ""),
      title: typeof data.title === "string" ? data.title : "",
      author: typeof data.author === "string" ? data.author : "",
      genre: parseGenres(data.genre),
      notes: content.trim(),
      dateRead: toDateRead(data.dateRead),
      recommend: isRecommended(data.recommend),
    };

    if (typeof data.cover === "string" && data.cover.length > 0) {
      book.cover = data.cover;
    }

    return book;
  });

  return books.sort((a, b) => (a.dateRead < b.dateRead ? 1 : -1));
}
