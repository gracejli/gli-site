import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import {
  booksMatchingFilter,
  groupBooksByMonth,
} from "@/content/library/books";
import { parseLibraryFilter } from "@/content/library/filters";
import { getBooks } from "@/content/library/loadBooks";
import LibraryCatalog from "./LibraryCatalog";

type LibraryPageProps = {
  searchParams?: Promise<{ view?: string; filter?: string; size?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = searchParams ? await searchParams : {};
  const view = params.view === "list" ? "list" : "grid";
  const filter = parseLibraryFilter(params.filter);
  const size = params.size === "large" ? "large" : "small";
  const books = getBooks();
  const months = groupBooksByMonth(
    view === "list" ? booksMatchingFilter(books, filter) : books,
  );

  return (
    <div className="min-h-screen px-4 pb-12 pt-6">
      <ShootingStarCursor />
      <LibraryCatalog months={months} view={view} filter={filter} size={size} />
    </div>
  );
}
