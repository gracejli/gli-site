import {
  ProjectGalleryPage,
  projectGalleryLinkClass,
} from "@/components/project-gallery-page";
import type { GalleryItem } from "@/components/image-gallery";

const coverItems: GalleryItem[] = [
  {
    id: "shiny-cover",
    url: "/images/shiny-objects2.png",
    alt: "Shiny objects syndrome — artwork",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

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
];

export default function ShinyObjectsPage() {
  return (
    <ProjectGalleryPage
      title="shiny objects syndrome"
      coverItems={coverItems}
      galleryItems={galleryItems}
    >
      <h2>1: 2D Animation</h2>
      <h3>“shiny objects” (2020)</h3>
      <p>
        2D animation — Toon Boom Harmony, Adobe Premiere, Adobe After Effects.
      </p>
      <p>
        <strong className="font-bold text-amber-100">Shiny object syndrome</strong>{" "}
        <em className="italic opacity-95">(n.)</em>: the tendency for someone to
        chase something new, be it a new idea, trend, or goal, rather than to stay
        focused on what they’re doing.
      </p>
      <p>
        <a
          href="https://www.youtube.com/watch?v=QfKiQ7uiS-w"
          className={projectGalleryLinkClass}
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube
        </a>
      </p>
    </ProjectGalleryPage>
  );
}
