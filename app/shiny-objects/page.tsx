import { ProjectGalleryPage } from "@/components/project-gallery-page";
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

export default async function ShinyObjectsPage() {
  return (
    <ProjectGalleryPage
      slug="shiny-objects"
      title="shiny objects syndrome"
      coverItems={coverItems}
      galleryItems={galleryItems}
    />
  );
}
