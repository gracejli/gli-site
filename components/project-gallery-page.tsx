import type { ReactNode } from "react";
import Link from "next/link";
import ImageGallery, { type GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

export const projectGalleryLinkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

const navLinkClass = projectGalleryLinkClass;

const proseClass =
  "space-y-6 text-[15px] leading-relaxed max-w-md font-fe [&_h2]:text-base [&_h2]:font-bianzhidai [&_h2]:mb-3 [&_h2]:mt-0 [&_h3]:text-sm [&_h3]:font-fe [&_h3]:mb-2 [&_h3]:mt-4 first:[&_h2]:mt-0 [&_h4]:text-sm [&_h4]:font-fe [&_h4]:font-bold [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-amber-200/95 [&_h4]:border-b [&_h4]:border-dashed [&_h4]:border-amber-200/35 [&_h4]:pb-1";

export type ProjectGalleryPageProps = {
  title: string;
  coverItems: GalleryItem[];
  galleryItems: GalleryItem[];
  children: ReactNode;
};

export function ProjectGalleryPage({
  title,
  coverItems,
  galleryItems,
  children,
}: ProjectGalleryPageProps) {
  return (
    <div className="min-h-screen background px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
      <ShootingStarCursor />
      <nav className="text-md font-rasterGrotesk shrink-0 mb-8 max-w-6xl mx-auto w-full">
        <Link href="/" className={navLinkClass}>
          home
        </Link>
        <span className="opacity-90"> :: </span>
        <Link href="/work" className={navLinkClass}>
          work
        </Link>
      </nav>

      <div className="flex flex-col md:flex-1 md:flex-row md:min-h-0 gap-10 md:gap-0 max-w-6xl mx-auto w-full min-h-0">
        <div className="w-full md:w-[45%] lg:w-[40%] md:pr-12 lg:pr-20 flex flex-col justify-between shrink-0 md:h-full md:min-h-0 md:overflow-y-auto">
          <div className="flex-1">
            <h1 className="text-lg font-bold font-bianzhidai mb-6">{title}</h1>
            <div className={proseClass}>{children}</div>
          </div>
        </div>
        <ImageGallery items={coverItems} columns={1} gap={2} />
        {galleryItems.length > 0 ? (
          <ImageGallery items={galleryItems} columns={3} gap={2} />
        ) : null}
      </div>
    </div>
  );
}
