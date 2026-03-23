"use client";

import Image from "next/image";
import { useState } from "react";

import { skeletonToneClass } from "@/lib/skeleton-tone";

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

export type GalleryImageProps = {
  item: GalleryImageItem;
  sizes: string;
  priority: boolean;
  /** Picks a stable red / blue / yellow fill for the loading layer. */
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

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div
        className={`${skeletonToneClass(index)} absolute inset-0 z-0`}
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
