import { ProjectGalleryPage } from "@/components/project-gallery-page";
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

export default async function GhostTownPage() {
  return (
    <ProjectGalleryPage
      slug="ghost-town"
      title="ghost town"
      coverItems={coverItems}
      galleryItems={[]}
    />
  );
}
