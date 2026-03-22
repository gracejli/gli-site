import { ProjectGalleryPage } from "@/components/project-gallery-page";
import type { GalleryItem } from "@/components/image-gallery";

const coverItems: GalleryItem[] = [
  {
    id: "triumvirate-cover",
    url: "/images/triumvirate-arena.png",
    alt: "Triumvirate Arena — key art and UI",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: "triumvirate-motion",
    url: "/images/triumvirate.gif",
    alt: "Triumvirate Arena — in-game motion",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

export default function TriumviratePage() {
  return (
    <ProjectGalleryPage
      title="triumvirate arena"
      coverItems={coverItems}
      galleryItems={galleryItems}
    >
      <h2>5: My Game Engine with Friends</h2>
      <h3>“triumvirate arena” (2022)</h3>
      <p>
        2D game and game engine — Photoshop, Rust, Vulkan, game dev. Battle
        arena card game as our own characters, made with friends in our own
        engine. The engine is in Rust with Vulkan for graphics. Playthrough
        video and code available upon request.
      </p>
    </ProjectGalleryPage>
  );
}
