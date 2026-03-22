import {
  ProjectGalleryPage,
  projectGalleryLinkClass,
} from "@/components/project-gallery-page";
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

export default function DormRoomVrPage() {
  return (
    <ProjectGalleryPage
      title="dorm room vr"
      coverItems={coverItems}
      galleryItems={galleryItems}
    >
      <h2>2: VR experience</h2>
      <h3>“dorm room VR” (2022)</h3>
      <p>
        VR experience — 3ds Max, Maya. Exploring the language of propaganda in
        COVID-era emails to the student body at Pomona College. Modeled
        replication of my dorm room in 2022.
      </p>
      <p>
        <a
          href="https://www.youtube.com/watch?v=obO2EAByyds"
          className={projectGalleryLinkClass}
          target="_blank"
          rel="noreferrer"
        >
          Video
        </a>
      </p>
      <p>
        Watch on mobile phone. Plus a photo of my room then (a little messy) —
        in the gallery.
      </p>
    </ProjectGalleryPage>
  );
}
