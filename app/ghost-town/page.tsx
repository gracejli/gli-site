import {
  ProjectGalleryPage,
  projectGalleryLinkClass,
} from "@/components/project-gallery-page";
import type { GalleryItem } from "@/components/image-gallery";

const coverItems: GalleryItem[] = [
  {
    id: "ghost-cover",
    url: "/images/ghost-town2.png",
    alt: "Ghost town — game artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

export default function GhostTownPage() {
  return (
    <ProjectGalleryPage
      title="ghost town"
      coverItems={coverItems}
      galleryItems={[]}
    >
      <h2>7: Immersive story game</h2>
      <h3>“ghost town” (2022)</h3>
      <p>
        2D game made in Unity — coding, game development, game design. Narrative
        single-player game; we follow the main character through his hometown as
        he discovers what has happened to everyone. Made in a team of four.
      </p>
      <p>
        <a
          href="https://github.com/williamconvertino/Ghost-Town"
          className={projectGalleryLinkClass}
          target="_blank"
          rel="noreferrer"
        >
          Repository
        </a>
      </p>
    </ProjectGalleryPage>
  );
}
