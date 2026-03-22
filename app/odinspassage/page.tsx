import {
  ProjectGalleryPage,
  projectGalleryLinkClass,
} from "@/components/project-gallery-page";
import type { GalleryItem } from "@/components/image-gallery";

const coverItems: GalleryItem[] = [
  {
    id: "odin-cover",
    url: "/images/odins-passage.png",
    alt: "Odin's Passage — key art",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: "odin-motion",
    url: "/images/odins.gif",
    alt: "Odin's Passage — gameplay",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

export default function OdinsPassagePage() {
  return (
    <ProjectGalleryPage
      title="odins passage"
      coverItems={coverItems}
      galleryItems={galleryItems}
    >
      <h2>Archive</h2>
      <h3>“Odin’s Passage” (2022)</h3>
      <p>
        3D game made in Unity — 3D modeling, coding, game design. Viking Odyssey
        × Crossy Road. Explored the mechanics of a very popular game but with a
        Scandinavian twist to top off our semester abroad in Denmark. Made in a
        group of three.
      </p>
      <ul className="list-disc ml-5 my-4 space-y-1">
        <li>
          <a
            href="https://github.com/azhuang639/Vikings"
            className={projectGalleryLinkClass}
            target="_blank"
            rel="noreferrer"
          >
            Repository
          </a>
        </li>
        <li>
          <a
            href="https://azhuang639.itch.io/odins-passage"
            className={projectGalleryLinkClass}
            target="_blank"
            rel="noreferrer"
          >
            Play the game
          </a>
        </li>
      </ul>
    </ProjectGalleryPage>
  );
}
