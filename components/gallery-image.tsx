"use client";

import Image from "next/image";
import { useState } from "react";

const DEFAULT_W = 1920;
const DEFAULT_H = 1080;

/** Matches `GalleryItem` fields used for rendering (defined in image-gallery). */
export type GalleryImageItem = {
  url: string;
  alt: string;
  imgClass: string;
  width?: number;
  height?: number;
};

const RGB_CYCLE_S = 2.4;

export type GalleryImageProps = {
  item: GalleryImageItem;
  sizes: string;
  priority: boolean;
  /** Used to offset the loading color cycle so each box shows a different hue. */
  index: number;
};

/** Maps gallery `imgClass` (written for <img>) to next/image `fill` layout. */
function imgClassForFill(imgClass: string) {
  return imgClass
    .replace(/\bh-auto\b/g, "h-full")
    .replace(/\bw-full\b/g, "w-full");
}

export function GalleryImage({ item, sizes, priority, index }: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const w = item.width ?? DEFAULT_W;
  const h = item.height ?? DEFAULT_H;

  const imgClass = imgClassForFill(item.imgClass);

  /** Negative delay advances the cycle so each box is on a different part of red → blue → yellow. */
  const skeletonDelay = -(index * (RGB_CYCLE_S / 5));

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div
        className="gallery-image-skeleton absolute inset-0 z-0"
        style={{ animationDelay: `${skeletonDelay}s` }}
        aria-hidden
      />
      <Image
        src={item.url}
        alt={item.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={[
          "z-10 transition-opacity duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          imgClass,
        ].join(" ")}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
