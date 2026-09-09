export type Book = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  notes: string;
  /** ISO date (YYYY-MM-DD). Used to group by month. */
  dateRead: string;
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

export type LibraryFilter = {
  slug: string;
  label: string;
};

export function listLibraryFilters(list: Book[]): LibraryFilter[] {
  const labels = [
    ...new Set(list.map((book) => book.genre).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  return [
    { slug: "all", label: "all" },
    ...labels.map((label) => ({ slug: filterSlug(label), label })),
  ];
}

export function booksMatchingFilter(list: Book[], filter: string): Book[] {
  if (!filter || filter === "all") return list;
  return list.filter((book) => filterSlug(book.genre) === filter);
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
