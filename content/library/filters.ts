import { filterSlug, type LibraryFilter } from "./books";

export const primaryLibraryFilters: LibraryFilter[] = [
  { slug: "all", label: "all" },
  { slug: "favorites", label: "favorites" },
];

/**
 * Extra filters shown under the caret. Add a label here to surface it.
 * "notes" is reserved (books with notes). "recommend" is reserved
 * (`recommend: "yes"`). Any other label matches a `genre`.
 * A genre on a book does not appear as a filter unless it is listed here.
 */
export const extraLibraryFilters = ["notes", "recommend", "book club"] as const;

export function extraLibraryFilterItems(): LibraryFilter[] {
  return extraLibraryFilters.map((label) => ({
    slug: filterSlug(label),
    label,
  }));
}

export function isExtraLibraryFilter(filter: string): boolean {
  return extraLibraryFilterItems().some((item) => item.slug === filter);
}

export function parseLibraryFilter(value?: string): string {
  if (!value) return "all";
  if (primaryLibraryFilters.some((item) => item.slug === value)) return value;
  if (isExtraLibraryFilter(value)) return value;
  return "all";
}
