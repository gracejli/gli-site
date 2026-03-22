import Link from "next/link";
import ImageGallery, { type GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

const galleryItems: GalleryItem[] = [
  {
    id: "shiny-motion",
    url: "/images/animation.gif",
    alt: "Shiny objects syndrome — animation",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "shiny-still",
    url: "/images/shiny-objects.png",
    alt: "Shiny objects — still",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "shiny-cover",
    url: "/images/shiny-objects/shiny objects 3.png",
    alt: "Shiny objects syndrome — artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "shiny-cover",
    url: "/images/shiny-objects/shiny objects 2.png",
    alt: "Shiny objects syndrome — artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "shiny-cover",
    url: "/images/shiny-objects/shiny objects.png",
    alt: "Shiny objects syndrome — artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "shiny-cover",
    url: "/images/shiny-objects/shiny objects 4.png",
    alt: "Shiny objects syndrome — artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

const inlineLinkClass =
  "underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function ShinyObjectsPage() {
  return (
    <div className="min-h-screen background px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
      <ShootingStarCursor />
      <nav className="text-md font-louize shrink-0 mb-8 max-w-6xl mx-auto w-full">
        <Link href="/" className={linkClass}>
          home
        </Link>
        <span className="opacity-90"> :: </span>
        <Link href="/work" className={linkClass}>
          work
        </Link>
      </nav>

      <div className="flex flex-col md:flex-1 md:flex-row md:min-h-0 gap-10 md:gap-0 max-w-6xl mx-auto w-full min-h-0">
        <div className="w-full md:w-[45%] lg:w-[40%] md:pr-12 lg:pr-20 flex flex-col justify-between shrink-0 md:h-full md:min-h-0 md:overflow-hidden">
          <div className="flex-1">
            <h1 className="text-lg font-bold font-louize mb-6">
              shiny objects syndrome
            </h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p className="font-louize text-base">1: 2D Animation</p>
              <p className="text-sm opacity-95">“shiny objects” (2020)</p>
              <p>
                2D animation — Toon Boom Harmony, Adobe Premiere, Adobe After
                Effects.
              </p>
              <p>
                <span className="font-bold text-amber-100">Shiny object syndrome</span>{" "}
                <em className="italic opacity-95">(n.)</em>: the tendency for
                someone to chase something new, be it a new idea, trend, or
                goal, rather than to stay focused on what they’re doing.
              </p>
              <p>
                <a
                  href="https://www.youtube.com/watch?v=QfKiQ7uiS-w"
                  className={inlineLinkClass}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on YouTube
                </a>
              </p>
            </div>
          </div>
        </div>
        <ImageGallery items={galleryItems} columns={2} gap={2} />
      </div>
    </div>
  );
}
