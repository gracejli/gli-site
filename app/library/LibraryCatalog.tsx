"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import { filterSlug, type Book, type BookMonthGroup } from "@/content/library/books";
import { skeletonToneClass } from "@/lib/skeleton-tone";

type MarkdownParagraphProps = React.ComponentPropsWithoutRef<"p">;
type MarkdownListProps = React.ComponentPropsWithoutRef<"ul">;
type MarkdownOrderedListProps = React.ComponentPropsWithoutRef<"ol">;
type MarkdownQuoteProps = React.ComponentPropsWithoutRef<"blockquote">;

const notesMarkdownComponents = {
  p: ({ children }: MarkdownParagraphProps) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }: MarkdownListProps) => (
    <ul className="my-2 list-disc pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: MarkdownOrderedListProps) => (
    <ol className="my-2 list-decimal pl-4 last:mb-0">{children}</ol>
  ),
  blockquote: ({ children }: MarkdownQuoteProps) => (
    <blockquote className="my-2 border-l-2 border-amber-400/70 pl-3 last:mb-0">
      {children}
    </blockquote>
  ),
};

function BookNotes({
  notes,
  className,
}: {
  notes: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown components={notesMarkdownComponents}>{notes}</ReactMarkdown>
    </div>
  );
}

export type LibraryView = "grid" | "list";
export type GridSize = "small" | "large";

const COVER_TONES = [
  { bg: "bg-[#6c000d]", fg: "text-[#ffd9a8]" },
  { bg: "bg-[#1a2744]", fg: "text-[#e8dcc8]" },
  { bg: "bg-[#3d4a32]", fg: "text-[#f0e6d0]" },
] as const;

const MONTH_BAR_COLORS = [
  "gallery-image-skeleton-red",
  "gallery-image-skeleton-yellow",
  "gallery-image-skeleton-blue",
] as const;

const GRID_LAYOUT: Record<
  GridSize,
  {
    minCols: number;
    maxCols: number;
    gap: number;
    cell: number;
    gapClass: string;
  }
> = {
  small: {
    minCols: 6,
    maxCols: 16,
    gap: 6,
    cell: 51,
    gapClass: "gap-x-1.5 gap-y-3",
  },
  large: {
    minCols: 4,
    maxCols: 8,
    gap: 12,
    cell: 102,
    gapClass: "gap-x-3 gap-y-6",
  },
};

function isFavorite(book: Book) {
  return filterSlug(book.genre) === "favorites";
}

function coverTone(index: number) {
  return COVER_TONES[index % COVER_TONES.length];
}

function TypographicCover({
  book,
  toneIndex,
  compact,
  className,
}: {
  book: Book;
  toneIndex: number;
  compact: boolean;
  className?: string;
}) {
  const tone = coverTone(toneIndex);

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden ${
        compact ? "px-1.5 py-1.5" : "px-3 py-4"
      } ${tone.bg} ${tone.fg} ${className ?? ""}`}
      aria-hidden
    >
      <p
        className={`font-editorial leading-snug tracking-wide ${
          compact ? "text-[9px]" : "text-[0.7rem]"
        }`}
      >
        {book.title}
      </p>
      <p
        className={`font-louize opacity-80 ${
          compact ? "text-[8px]" : "text-[0.65rem]"
        }`}
      >
        {book.author}
      </p>
    </div>
  );
}

function BookCover({
  book,
  toneIndex,
  className,
  compact = false,
  hoverCaption = false,
  sizes,
}: {
  book: Book;
  toneIndex: number;
  className?: string;
  compact?: boolean;
  hoverCaption?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!book.cover || failed) {
    return (
      <TypographicCover
        book={book}
        toneIndex={toneIndex}
        compact={compact}
        className={className}
      />
    );
  }

  return (
    <div className={`group/cover relative overflow-hidden ${className ?? ""}`}>
      <div
        className={`${skeletonToneClass(toneIndex)} absolute inset-0`}
        aria-hidden
      />
      <Image
        src={book.cover}
        alt=""
        fill
        unoptimized
        sizes={
          sizes ?? (compact ? "64px" : "(max-width: 768px) 22vw, 96px")
        }
        className={`object-cover transition-[opacity,filter] duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${hoverCaption ? "group-hover/cover:brightness-[0.45]" : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {hoverCaption ? (
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col justify-between text-[#f4ead8] opacity-0 transition-opacity duration-300 group-hover/cover:opacity-100 ${
            compact ? "px-1.5 py-1.5" : "px-3 py-4"
          }`}
        >
          <p
            className={`font-editorial leading-snug tracking-wide ${
              compact ? "text-[9px]" : "text-[0.7rem]"
            }`}
          >
            {book.title}
          </p>
          <p
            className={`font-louize opacity-80 ${
              compact ? "text-[8px]" : "text-[0.65rem]"
            }`}
          >
            {book.author}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ExpandableNotes({
  notes,
  className,
}: {
  notes: string;
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-1.5 w-full">
      <BookNotes
        notes={notes}
        className={`${className} ${isOpen ? "" : "line-clamp-3"}`}
      />
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="mt-0.5 cursor-pointer font-fe text-xs underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] focus:outline-none"
        aria-expanded={isOpen}
      >
        {isOpen ? "less" : "more..."}
      </button>
    </div>
  );
}

function libraryHref({
  view,
  filter,
  size,
}: {
  view: LibraryView;
  filter: string;
  size?: GridSize;
}) {
  const params = new URLSearchParams();
  if (view === "list") params.set("view", "list");
  if (view === "grid" && size === "large") params.set("size", "large");
  if (filter && filter !== "all") params.set("filter", filter);
  const query = params.toString();
  return query ? `/library?${query}` : "/library";
}

function navLinkClass(active: boolean) {
  return `underline underline-offset-2 transition-all duration-200 ${
    active
      ? "text-white drop-shadow-[0_0_12px_rgba(253,224,71,0.95)]"
      : "hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
  }`;
}

function iconButtonClass(active: boolean) {
  return `inline-flex items-center justify-center p-0.5 transition-all duration-200 ${
    active
      ? "text-white drop-shadow-[0_0_12px_rgba(253,224,71,0.95)]"
      : "opacity-55 hover:opacity-100 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
  }`;
}

function FilterBar({
  filter,
  view,
  size,
}: {
  filter: string;
  view: LibraryView;
  size: GridSize;
}) {
  const filters = [
    { slug: "all", label: "all" },
    { slug: "favorites", label: "favorites" },
  ] as const;

  return (
    <nav
      className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 font-fe text-xs uppercase tracking-[0.14em]"
      aria-label="Library filters"
    >
      {filters.map((item) => {
        const active = item.slug === filter;
        return (
          <Link
            key={item.slug}
            href={libraryHref({ view, filter: item.slug, size })}
            className={navLinkClass(active)}
            aria-current={active ? "page" : undefined}
            scroll={false}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ViewToggle({
  view,
  filter,
  size,
}: {
  view: LibraryView;
  filter: string;
  size: GridSize;
}) {
  const smallActive = view === "grid" && size === "small";
  const largeActive = view === "grid" && size === "large";

  return (
    <div className="flex shrink-0 items-center gap-3">
      <Link
        href={libraryHref({ view: "grid", filter, size: "small" })}
        className={iconButtonClass(smallActive)}
        aria-label="Small grid"
        aria-current={smallActive ? "page" : undefined}
        scroll={false}
      >
        <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
          <span className="size-[5px] border border-current" />
          <span className="size-[5px] border border-current" />
          <span className="size-[5px] border border-current" />
          <span className="size-[5px] border border-current" />
        </span>
      </Link>
      <Link
        href={libraryHref({ view: "grid", filter, size: "large" })}
        className={iconButtonClass(largeActive)}
        aria-label="Large grid"
        aria-current={largeActive ? "page" : undefined}
        scroll={false}
      >
        <span
          className="block h-[18px] w-[12px] border border-current"
          aria-hidden
        />
      </Link>
      <Link
        href={libraryHref({ view: "list", filter, size })}
        className={iconButtonClass(view === "list")}
        aria-label="List"
        aria-current={view === "list" ? "page" : undefined}
        scroll={false}
      >
        <span className="flex flex-col gap-[3px]" aria-hidden>
          <span className="h-px w-[14px] bg-current" />
          <span className="h-px w-[14px] bg-current" />
          <span className="h-px w-[14px] bg-current" />
        </span>
      </Link>
    </div>
  );
}

function MonthBar({
  label,
  toneIndex,
  connectLeft,
  connectRight,
  compact,
}: {
  label: string;
  toneIndex: number;
  connectLeft: boolean;
  connectRight: boolean;
  compact: boolean;
}) {
  const color = MONTH_BAR_COLORS[toneIndex % MONTH_BAR_COLORS.length];

  return (
    <div
      className={`group/monthbar relative z-10 w-full ${
        compact ? "mb-0.5 h-2" : "mb-1 h-4"
      }`}
    >
      <div
        className={`absolute top-0 cursor-default ${color} ${
          compact ? "h-1" : "h-1.5"
        } ${
          connectLeft
            ? compact
              ? "-left-[3px]"
              : "-left-1.5"
            : "left-0 rounded-l-[1px]"
        } ${
          connectRight
            ? compact
              ? "-right-[3px]"
              : "-right-1.5"
            : "right-0 rounded-r-[1px]"
        }`}
        tabIndex={0}
        aria-label={`Read in ${label}`}
      />
      <p className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 whitespace-nowrap rounded bg-black/85 px-2 py-0.5 font-fe text-xs text-amber-50 opacity-0 shadow-md transition-opacity duration-150 group-hover/monthbar:opacity-100 group-focus-within/monthbar:opacity-100">
        {label}
      </p>
    </div>
  );
}

function NotesIcon({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 14 10"
      width={compact ? 12 : 16}
      height={compact ? 9 : 12}
      className="mt-1"
      aria-hidden
    >
      <rect x="0" y="0" width="14" height="2" rx="1" fill="#8b7cc8" />
      <rect x="0" y="4" width="8.5" height="2" rx="1" fill="#8b7cc8" />
      <rect x="0" y="8" width="14" height="2" rx="1" fill="#8b7cc8" />
    </svg>
  );
}

function GridBook({
  book,
  toneIndex,
  monthLabel,
  monthToneIndex,
  connectLeft,
  connectRight,
  dimmed,
  selected,
  onSelect,
  compact,
}: {
  book: Book;
  toneIndex: number;
  monthLabel: string;
  monthToneIndex: number;
  connectLeft: boolean;
  connectRight: boolean;
  dimmed: boolean;
  selected: boolean;
  onSelect: () => void;
  compact: boolean;
}) {
  return (
    <article
      data-book-slug={book.slug}
      className={`flex flex-col transition-[opacity,filter] duration-300 ${
        dimmed ? "opacity-35 grayscale" : ""
      }`}
    >
      <MonthBar
        label={monthLabel}
        toneIndex={monthToneIndex}
        connectLeft={connectLeft}
        connectRight={connectRight}
        compact={compact}
      />
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${book.title} by ${book.author}${book.notes ? ", has notes" : ""}`}
        className={`relative w-full cursor-pointer border-2 transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none ${
          selected
            ? "border-dashed border-amber-400 bg-amber-400/10 shadow-[0_0_24px_rgba(253,224,71,0.3)]"
            : "border-transparent hover:border-dashed hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_24px_rgba(253,224,71,0.3)]"
        }`}
      >
        <BookCover
          book={book}
          toneIndex={toneIndex}
          compact={compact}
          hoverCaption
          className="aspect-[2/3] w-full"
        />
      </button>
      {book.notes ? <NotesIcon compact={compact} /> : null}
    </article>
  );
}

function ListBook({
  book,
  toneIndex,
}: {
  book: Book;
  toneIndex: number;
}) {
  return (
    <article className="flex gap-4 items-start">
      <BookCover
        book={book}
        toneIndex={toneIndex}
        compact
        className="h-24 w-16 shrink-0"
      />
      <div className="min-w-0 pt-0.5">
        <h3 className="font-fe text-base leading-snug text-[var(--foreground)]">
          {book.title}
        </h3>
        <p className="mt-1 font-editorial text-sm text-[var(--foreground)]">
          {book.author}
          {book.genre ? (
            <>
              <span className="mx-1.5 opacity-50">·</span>
              <span className="font-fe text-xs uppercase tracking-wide opacity-80">
                {book.genre}
              </span>
            </>
          ) : null}
        </p>
        {book.notes ? (
          <ExpandableNotes
            notes={book.notes}
            className="font-louize text-sm leading-snug text-[var(--foreground)]/90"
          />
        ) : null}
      </div>
    </article>
  );
}

function SelectedBookPane({
  book,
  toneIndex,
  monthLabel,
}: {
  book: Book;
  toneIndex: number;
  monthLabel: string;
}) {
  return (
    <div className="flex gap-3 lg:flex-col lg:gap-0">
      <div className="w-fit shrink-0">
        <BookCover
          book={book}
          toneIndex={toneIndex}
          className="aspect-[2/3] w-16 lg:w-28"
          sizes="(max-width: 1024px) 64px, 112px"
        />
      </div>
      <div className="min-w-0 lg:mt-3">
        <h3 className="font-fe text-base leading-snug text-white drop-shadow-[0_0_12px_rgba(253,224,71,0.7)] lg:text-lg">
          {book.title}
        </h3>
        <p className="mt-1 font-editorial text-sm text-[var(--foreground)]">
          {book.author}
          {book.genre ? (
            <>
              <span className="mx-1.5 opacity-50">·</span>
              <span className="font-fe text-xs uppercase tracking-wide opacity-80">
                {book.genre}
              </span>
            </>
          ) : null}
        </p>
        {book.notes ? (
          <div
            data-library-notes
            className="mt-2 max-h-[18vh] overflow-y-auto overscroll-contain pr-1 lg:mt-3 lg:max-h-[min(28vh,14rem)]"
          >
            <BookNotes
              notes={book.notes}
              className="font-louize text-sm leading-relaxed text-[var(--foreground)]/90"
            />
          </div>
        ) : (
          <p className="mt-2 font-louize text-sm opacity-50 lg:mt-3">
            read {monthLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function LibraryGrid({
  months,
  filter,
  size,
}: {
  months: BookMonthGroup[];
  filter: string;
  size: GridSize;
}) {
  const layout = GRID_LAYOUT[size];
  const compact = size === "small";
  const gridRef = useRef<HTMLDivElement>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  const [columnCount, setColumnCount] = useState<number>(layout.maxCols);
  const [cellPx, setCellPx] = useState<number>(layout.cell);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    const flat = months.flatMap((month, monthIndex) =>
      month.books.map((book) => ({
        book,
        monthKey: month.key,
        monthLabel: month.label,
        monthToneIndex: monthIndex,
      })),
    );
    if (filter !== "favorites") return flat;
    return [
      ...flat.filter((item) => isFavorite(item.book)),
      ...flat.filter((item) => !isFavorite(item.book)),
    ];
  }, [months, filter]);

  useLayoutEffect(() => {
    setSelectedIndex((current) => {
      if (current === null || items.length === 0) return null;
      return current < items.length ? current : null;
    });
  }, [items]);

  const selected =
    selectedIndex === null ? null : (items[selectedIndex] ?? null);
  const paneOpen = selected !== null;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const [previewDocked, setPreviewDocked] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !paneOpen) {
      setPreviewDocked(false);
      return;
    }

    const mobile = window.matchMedia("(max-width: 1023px)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setPreviewDocked(mobile.matches && !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(sentinel);

    const onMq = () => {
      if (!mobile.matches) setPreviewDocked(false);
    };
    mobile.addEventListener("change", onMq);

    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", onMq);
    };
  }, [paneOpen]);

  useLayoutEffect(() => {
    const gridWrap = gridWrapRef.current;
    const aside = asideRef.current;
    if (!gridWrap) return;

    const updateClip = () => {
      if (!previewDocked || !aside) {
        gridWrap.style.clipPath = "";
        return;
      }
      const overlay = aside.getBoundingClientRect();
      const grid = gridWrap.getBoundingClientRect();
      const clipTop = Math.max(0, overlay.bottom - grid.top);
      gridWrap.style.clipPath =
        clipTop > 0 ? `inset(${clipTop}px 0 0 0)` : "";
    };

    updateClip();
    window.addEventListener("scroll", updateClip, { passive: true });
    window.addEventListener("resize", updateClip);
    return () => {
      window.removeEventListener("scroll", updateClip);
      window.removeEventListener("resize", updateClip);
      gridWrap.style.clipPath = "";
    };
  }, [previewDocked, selectedIndex]);

  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root) return;

    const updateCols = () => {
      const width = root.clientWidth;
      const fitted = Math.floor(
        (width + layout.gap) / (layout.cell + layout.gap),
      );
      const cols = Math.min(
        layout.maxCols,
        Math.max(layout.minCols, fitted || layout.minCols),
      );
      const needed = cols * layout.cell + (cols - 1) * layout.gap;
      setColumnCount(cols);
      setCellPx(
        needed > width
          ? Math.max(0, (width - (cols - 1) * layout.gap) / cols)
          : layout.cell,
      );
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    observer.observe(root);
    return () => observer.disconnect();
  }, [paneOpen, layout]);

  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root) return;

    const nodes = [
      ...root.querySelectorAll<HTMLElement>("[data-book-slug]"),
    ];

    for (const node of nodes) {
      const slug = node.dataset.bookSlug;
      if (!slug) continue;
      const prev = prevRects.current.get(slug);
      if (!prev) continue;
      const next = node.getBoundingClientRect();
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx === 0 && dy === 0) continue;
      node.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }

    prevRects.current = new Map(
      nodes.flatMap((node) => {
        const slug = node.dataset.bookSlug;
        return slug ? [[slug, node.getBoundingClientRect()] as const] : [];
      }),
    );
  }, [items, columnCount, cellPx]);

  return (
    <div
      className={
        paneOpen
          ? "flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(9rem,0.4fr)] lg:items-start lg:gap-8"
          : undefined
      }
    >
      <div
        ref={gridWrapRef}
        className={paneOpen ? "order-2 lg:order-1" : undefined}
      >
        <div
          ref={gridRef}
          className={`grid justify-center ${layout.gapClass}`}
          style={{
            gridTemplateColumns: `repeat(${columnCount}, ${cellPx}px)`,
          }}
        >
          {items.map((item, index, all) => {
            const col = index % columnCount;
            const connectLeft =
              col !== 0 && all[index - 1]?.monthKey === item.monthKey;
            const connectRight =
              col !== columnCount - 1 &&
              all[index + 1]?.monthKey === item.monthKey;
            return (
              <GridBook
                key={item.book.slug}
                book={item.book}
                toneIndex={index}
                monthLabel={item.monthLabel}
                monthToneIndex={item.monthToneIndex}
                connectLeft={connectLeft}
                connectRight={connectRight}
                dimmed={filter === "favorites" && !isFavorite(item.book)}
                selected={index === selectedIndex}
                compact={compact}
                onSelect={() =>
                  setSelectedIndex((current) =>
                    current === index ? null : index,
                  )
                }
              />
            );
          })}
        </div>
      </div>
      {paneOpen ? (
        <div
          ref={sentinelRef}
          className="h-px w-full lg:hidden"
          aria-hidden
        />
      ) : null}
      {selected ? (
        <aside
          ref={asideRef}
          className={`sticky z-20 order-1 lg:top-24 lg:order-2 ${
            previewDocked
              ? "top-0 -mx-4 border-b-2 border-dotted border-amber-400 bg-transparent px-4 pb-3 pt-20"
              : "top-20"
          }`}
        >
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className={`font-fe text-xs uppercase tracking-[0.14em] ${navLinkClass(false)}`}
              aria-label="Hide book details"
            >
              hide
            </button>
          </div>
          <SelectedBookPane
            key={selected.book.slug}
            book={selected.book}
            toneIndex={selectedIndex ?? 0}
            monthLabel={selected.monthLabel}
          />
        </aside>
      ) : null}
    </div>
  );
}

export default function LibraryCatalog({
  months,
  view,
  filter,
  size,
}: {
  months: BookMonthGroup[];
  view: LibraryView;
  filter: string;
  size: GridSize;
}) {
  let toneIndex = 0;

  return (
    <div className={`mx-auto ${view === "grid" ? "max-w-5xl" : "max-w-4xl"}`}>
      <div className="flex items-center justify-between gap-4">
        <FilterBar filter={filter} view={view} size={size} />
        <ViewToggle view={view} filter={filter} size={size} />
      </div>

      <div className="mt-10">
        {months.length === 0 ? (
          <p className="font-fe text-sm opacity-70">no books in this filter.</p>
        ) : view === "grid" ? (
          <LibraryGrid months={months} filter={filter} size={size} />
        ) : (
          <div className="mx-auto flex max-w-md flex-col gap-14">
            {months.map((month) => (
              <section key={month.key}>
                <h2 className="mb-6 font-bianzhidai text-lg text-[var(--foreground)]">
                  {month.label}
                </h2>
                <div className="flex flex-col gap-8">
                  {month.books.map((book) => {
                    const index = toneIndex++;
                    return (
                      <ListBook key={book.slug} book={book} toneIndex={index} />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
