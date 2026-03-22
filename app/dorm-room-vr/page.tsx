import { ProjectGalleryPage } from "@/components/project-gallery-page";
import type { GalleryItem } from "@/components/image-gallery";

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

export default async function DormRoomVrPage() {
  return (
    <ProjectGalleryPage
      slug="dorm-room-vr"
      title="dorm room vr"
      coverItems={coverItems}
      galleryItems={galleryItems}
    />
  );
}
