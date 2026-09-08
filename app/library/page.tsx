import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import {
  books,
  booksMatchingFilter,
  groupBooksByMonth,
} from "@/content/library/books";
import LibraryCatalog from "./LibraryCatalog";

type LibraryPageProps = {
  searchParams?: Promise<{ view?: string; filter?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = searchParams ? await searchParams : {};
  const view = params.view === "list" ? "list" : "grid";
  const filter = params.filter === "favorites" ? "favorites" : "all";
  const months = groupBooksByMonth(
    view === "list" ? booksMatchingFilter(books, filter) : books,
  );

  return (
    <div className="min-h-screen px-4 pb-12 pt-6">
      <ShootingStarCursor />
      <LibraryCatalog months={months} view={view} filter={filter} />
    </div>
  );
}
