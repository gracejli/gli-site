import Link from "next/link";
import ImageGallery, { type GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

const coverItems: GalleryItem[] = [
  {
    id: "ghost-cover",
    url: "/images/ghost-town2.png",
    alt: "Ghost town — game artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

const inlineLinkClass =
  "underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function GhostTownPage() {
  return (
    <div className="min-h-screen background px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
      <ShootingStarCursor />
      <nav className="text-md font-rasterGrotesk shrink-0 mb-8 max-w-6xl mx-auto w-full">
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
            <h1 className="text-lg font-bold font-rasterGrotesk mb-6">ghost town</h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p className="text-sm font-rasterGrotesk text-base">immersive story game built in Unity</p>
              <p>
                2D game made in Unity — coding, game development, game design.
                Narrative single-player game; we follow the main character
                through his hometown as he discovers what has happened to
                everyone. Made in a team of four.
              </p>
              <p>
                *{" "}
                <a
                  href="https://github.com/williamconvertino/Ghost-Town"
                  className={inlineLinkClass}
                  target="_blank"
                  rel="noreferrer"
                >
                  Repository
                </a>
              </p>
            </div>
          </div>
        </div>
        <ImageGallery items={coverItems} columns={1} gap={2} />
      </div>
    </div>
  );
}
