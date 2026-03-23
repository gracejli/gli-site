import Link from "next/link";
import ImageGallery, { type GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

function triumvirateItem(
  file: string,
  id: string,
  alt: string,
  caption?: string,
): GalleryItem {
  return {
    id,
    url: `/images/triumvirate/${encodeURIComponent(file)}`,
    alt,
    caption,
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  };
}

const triumvirateImages: GalleryItem[] = [
  triumvirateItem(
    "playthrough.gif",
    "triumvirate-playthrough",
    "Triumvirate Arena — playthrough",
    "Playthrough gif"
  ),
  triumvirateItem(
    "player select screen.png",
    "triumvirate-player-select",
    "Triumvirate Arena — player select screen",
    "Player select screen",
  ),
  triumvirateItem(
    "fight screen.png",
    "triumvirate-fight-screen",
    "Triumvirate Arena — fight screen",
    "Fight screen, health and mana"
  ),
  triumvirateItem(
    "nate moves.gif",
    "triumvirate-nate-moves",
    "Triumvirate Arena — Nate moves",
    "Nate moves walkthrough"
  ),
  triumvirateItem(
    "grace li .gif",
    "triumvirate-grace-li",
    "Triumvirate Arena — Grace Li",
    "Grace moves walkthrough"
  ),
  triumvirateItem(
    "click through.gif",
    "triumvirate-click-through",
    "Triumvirate Arena — click through",
    "Chloe moves walkthrough"
  ),

  triumvirateItem(
    "nate movces.png",
    "triumvirate-nate-movces",
    "Triumvirate Arena — Nate",
    "Nate move selection screen",
  ),
  triumvirateItem(
    "chloe playscreen.png",
    "triumvirate-chloe-playscreen",
    "Triumvirate Arena — Chloe playscreen",
    "Chloe move selection screen",
  ),
  triumvirateItem(
    "grace playscreen.png",
    "triumvirate-grace-playscreen",
    "Triumvirate Arena — Grace playscreen",
    "Grace move selection screen"
  ),

];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function TriumviratePage() {
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
              triumvirate arena
            </h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p className="font-rasterGrotesk text-base">Rust Game Engine</p>
              <p className="opacity-95">“triumvirate arena” (2022)</p>
              <p>
                2D game and game engine — Photoshop, Rust, Vulkan, game dev.
                Battle arena card game as our own characters, made with friends
                in our own engine. The engine is in Rust with Vulkan for
                graphics. Playthrough video and code available upon request.
              </p>
            </div>
          </div>
        </div>
        <ImageGallery items={triumvirateImages} columns={3} gap={2} />
      </div>
    </div>
  );
}
