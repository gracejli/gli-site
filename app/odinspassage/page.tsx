import { ProjectGalleryPage } from "@/components/project-gallery-page";
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

export default async function OdinsPassagePage() {
  return (
    <ProjectGalleryPage
      slug="odinspassage"
      title="odins passage"
      coverItems={coverItems}
      galleryItems={galleryItems}
    />
  );
}
