import Link from "next/link";
import ImageGallery, { type GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

const coverItems: GalleryItem[] = [
  {
    id: "dorm-cover",
    url: "/images/oldenborg-room.png",
    alt: "Dorm room VR — room render",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: "dorm-motion",
    url: "/images/dormRoom.gif",
    alt: "Dorm room VR — motion",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

const inlineLinkClass =
  "underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function DormRoomVrPage() {
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
            <h1 className="text-lg font-bold font-rasterGrotesk mb-6">
              dorm room vr
            </h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p className="text-sm font-rasterGrotesk text-base">VR experience, 3D Modeling. Made with: 3ds Max, Maya.</p>
              <p>
                Exploring the language of propaganda in COVID-era emails to the student body at Pomona
                College. Modeled replication of my dorm room in 2022.
              </p>
              <p>
                <a
                  href="https://www.youtube.com/watch?v=obO2EAByyds"
                  className={inlineLinkClass}
                  target="_blank"
                  rel="noreferrer"
                >
                  Video
                </a>
              </p>
              <p>
                Watch on mobile phone. Plus a photo of my room then (a little
                messy) — in the gallery.
              </p>
            </div>
          </div>
        </div>
        <ImageGallery items={coverItems} columns={1} gap={2} />
        <ImageGallery items={galleryItems} columns={3} gap={2} />
      </div>
    </div>
  );
}
