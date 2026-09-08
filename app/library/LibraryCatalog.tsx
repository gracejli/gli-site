"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { filterSlug, type Book, type BookMonthGroup } from "@/content/library/books";
import { skeletonToneClass } from "@/lib/skeleton-tone";

export type LibraryView = "grid" | "list";

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

const MIN_COLS = 4;
const MAX_COLS = 8;
const GRID_GAP_PX = 12;
const IDEAL_CELL_PX = 102;

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
}: {
  book: Book;
  toneIndex: number;
  className?: string;
  compact?: boolean;
  hoverCaption?: boolean;
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
        sizes={compact ? "64px" : "(max-width: 768px) 22vw, 96px"}
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
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      if (expanded) return;
      setTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [notes, expanded]);

  const interactive = truncated || expanded;

  const body = (
    <>
      <p
        ref={textRef}
        className={`whitespace-pre-line ${className} ${expanded ? "" : "line-clamp-5"}`}
      >
        {notes}
      </p>
      {truncated && !expanded ? <span className="mt-0.5 block">(...)</span> : null}
    </>
  );

  if (!interactive) {
    return <div className="mt-1.5">{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      className="mt-1.5 w-full cursor-pointer text-left focus:outline-none focus-visible:underline"
      aria-expanded={expanded}
    >
      {body}
    </button>
  );
}

function libraryHref({
  view,
  filter,
}: {
  view: LibraryView;
  filter: string;
}) {
  const params = new URLSearchParams();
  if (view === "list") params.set("view", "list");
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

function FilterBar({
  filter,
  view,
}: {
  filter: string;
  view: LibraryView;
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
            href={libraryHref({ view, filter: item.slug })}
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

function ViewToggle({ view, filter }: { view: LibraryView; filter: string }) {
  return (
    <div className="flex shrink-0 items-center gap-4 font-rasterGrotesk text-md">
      <Link
        href={libraryHref({ view: "grid", filter })}
        className={navLinkClass(view === "grid")}
        aria-current={view === "grid" ? "page" : undefined}
        scroll={false}
      >
        grid
      </Link>
      <Link
        href={libraryHref({ view: "list", filter })}
        className={navLinkClass(view === "list")}
        aria-current={view === "list" ? "page" : undefined}
        scroll={false}
      >
        list
      </Link>
    </div>
  );
}

function MonthBar({
  label,
  toneIndex,
  connectLeft,
  connectRight,
}: {
  label: string;
  toneIndex: number;
  connectLeft: boolean;
  connectRight: boolean;
}) {
  const color = MONTH_BAR_COLORS[toneIndex % MONTH_BAR_COLORS.length];

  return (
    <div className="group/monthbar relative z-10 mb-1 h-4 w-full">
      <div
        className={`absolute top-0 h-1.5 cursor-default ${color} ${
          connectLeft ? "-left-1.5" : "left-0 rounded-l-[1px]"
        } ${connectRight ? "-right-1.5" : "right-0 rounded-r-[1px]"}`}
        tabIndex={0}
        aria-label={`Read in ${label}`}
      />
      <p className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 whitespace-nowrap rounded bg-black/85 px-2 py-0.5 font-fe text-xs text-amber-50 opacity-0 shadow-md transition-opacity duration-150 group-hover/monthbar:opacity-100 group-focus-within/monthbar:opacity-100">
        {label}
      </p>
    </div>
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
  onOpenReview,
}: {
  book: Book;
  toneIndex: number;
  monthLabel: string;
  monthToneIndex: number;
  connectLeft: boolean;
  connectRight: boolean;
  dimmed: boolean;
  onOpenReview: () => void;
}) {
  const hasReview = Boolean(book.notes);

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
      />
      <BookCover
        book={book}
        toneIndex={toneIndex}
        compact
        hoverCaption
        className="aspect-[2/3] w-full"
      />
      {hasReview ? (
        <button
          type="button"
          onClick={onOpenReview}
          className="mt-2 w-fit cursor-pointer text-left font-fe text-xs leading-snug text-[var(--foreground)] underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] focus:outline-none focus-visible:text-white focus-visible:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
          aria-label={`Read notes on ${book.title}`}
        >
          notes
        </button>
      ) : null}
    </article>
  );
}

function ListBook({
  book,
  toneIndex,
  fullNotes = false,
}: {
  book: Book;
  toneIndex: number;
  fullNotes?: boolean;
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
          fullNotes ? (
            <p className="mt-1.5 font-louize text-sm leading-snug whitespace-pre-line text-[var(--foreground)]/90">
              {book.notes}
            </p>
          ) : (
            <ExpandableNotes
              notes={book.notes}
              className="font-louize text-sm leading-snug text-[var(--foreground)]/90"
            />
          )
        ) : null}
      </div>
    </article>
  );
}

function ReviewPopup({
  book,
  toneIndex,
  onClose,
}: {
  book: Book;
  toneIndex: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-review-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl border border-amber-200/60 bg-black/90 p-6 pt-12 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1.5 text-amber-100 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
          aria-label="Close review"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
        <h2 id="library-review-title" className="sr-only">
          {book.title}
        </h2>
        <ListBook book={book} toneIndex={toneIndex} fullNotes />
      </div>
    </div>
  );
}

function LibraryGrid({
  months,
  filter,
  onOpenReview,
}: {
  months: BookMonthGroup[];
  filter: string;
  onOpenReview: (book: Book, toneIndex: number) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  const [columnCount, setColumnCount] = useState(8);
  const [cellPx, setCellPx] = useState(IDEAL_CELL_PX);

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
    const root = gridRef.current;
    if (!root) return;

    const updateCols = () => {
      const width = root.clientWidth;
      const fitted = Math.floor(
        (width + GRID_GAP_PX) / (IDEAL_CELL_PX + GRID_GAP_PX),
      );
      const cols = Math.min(MAX_COLS, Math.max(MIN_COLS, fitted || MIN_COLS));
      const needed = cols * IDEAL_CELL_PX + (cols - 1) * GRID_GAP_PX;
      setColumnCount(cols);
      setCellPx(
        needed > width
          ? Math.max(0, (width - (cols - 1) * GRID_GAP_PX) / cols)
          : IDEAL_CELL_PX,
      );
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

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
      ref={gridRef}
      className="grid justify-center gap-x-3 gap-y-6"
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
            onOpenReview={() => onOpenReview(item.book, index)}
          />
        );
      })}
    </div>
  );
}

export default function LibraryCatalog({
  months,
  view,
  filter,
}: {
  months: BookMonthGroup[];
  view: LibraryView;
  filter: string;
}) {
  const [openReview, setOpenReview] = useState<{
    book: Book;
    toneIndex: number;
  } | null>(null);
  let toneIndex = 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <FilterBar filter={filter} view={view} />
        <ViewToggle view={view} filter={filter} />
      </div>

      <div className="mt-10">
        {months.length === 0 ? (
          <p className="font-fe text-sm opacity-70">no books in this filter.</p>
        ) : view === "grid" ? (
          <LibraryGrid
            months={months}
            filter={filter}
            onOpenReview={(book, toneIndex) =>
              setOpenReview({ book, toneIndex })
            }
          />
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
      {openReview ? (
        <ReviewPopup
          book={openReview.book}
          toneIndex={openReview.toneIndex}
          onClose={() => setOpenReview(null)}
        />
      ) : null}
    </div>
  );
}
