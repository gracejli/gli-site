export type Book = {
  slug: string;
  title: string;
  author: string;
  /** One or more labels from front matter (`genre: "sci fi"` or a YAML list). */
  genre: string[];
  notes: string;
  /** ISO date (YYYY-MM-DD). Used to group by month. */
  dateRead: string;
  /** True when front matter has `recommend: "yes"`. */
  recommend: boolean;
  /** Optional path under `public/` or a remote cover URL. */
  cover?: string;
};

export type BookMonthGroup = {
  key: string;
  label: string;
  books: Book[];
};

export function filterSlug(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "-");
}

export function isRecommended(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") return value.trim().toLowerCase() === "yes";
  return false;
}

export function parseGenres(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item !== "string") return [];
      const trimmed = item.trim();
      return trimmed ? [trimmed] : [];
    });
  }
  return [];
}

export function genreLabel(genre: string[]): string {
  return genre.join(" · ");
}

export type LibraryFilter = {
  slug: string;
  label: string;
};

export function bookMatchesFilter(book: Book, filter: string): boolean {
  if (!filter || filter === "all") return true;
  if (filter === "notes") return Boolean(book.notes);
  if (filter === "recommend") return book.recommend;
  return book.genre.some((label) => filterSlug(label) === filter);
}

export function booksMatchingFilter(list: Book[], filter: string): Book[] {
  if (!filter || filter === "all") return list;
  return list.filter((book) => bookMatchesFilter(book, filter));
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function monthKey(dateRead: string): string {
  return dateRead.slice(0, 7);
}

export function groupBooksByMonth(list: Book[]): BookMonthGroup[] {
  const sorted = [...list].sort((a, b) => (a.dateRead < b.dateRead ? 1 : -1));
  const groups = new Map<string, Book[]>();

  for (const book of sorted) {
    const key = monthKey(book.dateRead);
    const existing = groups.get(key);
    if (existing) {
      existing.push(book);
    } else {
      groups.set(key, [book]);
    }
  }

  return [...groups.entries()].map(([key, monthBooks]) => {
    const [year, month] = key.split("-").map(Number);
    const label = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
    return { key, label, books: monthBooks };
  });
}
