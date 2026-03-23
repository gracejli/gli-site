export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  /** Shown below the image when set. */
  caption?: string;
  /** Overrides default caption styling when set. */
  captionClassName?: string;
  wrapperClass: string;
  imgClass: string;
}

const gapClass = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
} as const;

export type ImageGalleryGap = keyof typeof gapClass;

export type ImageGalleryProps = {
  items: GalleryItem[];
  /**
   * Column count. `1` (default) keeps a vertical stack; `2+` uses CSS Grid
   * with that many columns and as many rows as the items need.
   */
  columns?: number;
  /**
   * Optional fixed row template (`grid-template-rows`). Extra items still
   * create implicit rows below, same as normal grid behavior.
   */
  rows?: number;
  /** Spacing between cells (Tailwind gap scale). */
  gap?: ImageGalleryGap;
  className?: string;
};

function ImageGallery({
  items,
  columns = 1,
  rows,
  gap = 4,
  className = "",
}: ImageGalleryProps) {
  const safeCols = Math.max(1, Math.floor(columns));
  const useGrid = safeCols > 1 || rows != null;

  const gridStyle =
    useGrid
      ? {
          display: "grid" as const,
          gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))`,
          ...(rows != null && rows > 0
            ? {
                gridTemplateRows: `repeat(${Math.floor(rows)}, minmax(0, auto))`,
              }
            : {}),
        }
      : undefined;

  return (
    <div
      className={[
        "w-full md:w-[55%] lg:w-[60%] md:flex-1 md:min-h-0 overflow-y-auto md:pl-6 lg:pl-8",
        gapClass[gap],
        useGrid ? "" : "flex flex-col",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={gridStyle}
    >
      {items.map((item) => (
        <figure key={item.id} className={item.wrapperClass}>
          <img
            src={item.url}
            alt={item.alt}
            className={item.imgClass}
            loading="lazy"
          />
          {item.caption ? (
            <figcaption
              className={
                item.captionClassName ??
                "mt-2 text-xs font-fe leading-snug text-amber-100/70"
              }
            >
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export default ImageGallery;
