import Link from "next/link";
import ImageGallery, { GalleryItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

/** Add optional `caption` on any entry; shown under the image in the gallery. */
const walmartImageFiles: { file: string; caption?: string }[] = [
  { file: "IMG_7131.JPG" },
  { file: "IMG_7145.JPG" },
  { file: "IMG_7150.JPG" },
  { file: "IMG_7173.JPG" },
  { file: "IMG_7195.JPG" },
  { file: "IMG_7224.JPG" },
  { file: "IMG_7232.JPG" },
  { file: "IMG_7242.JPG" },
  { file: "IMG_7258.JPG" },
  { file: "IMG_7276.JPG" },
  { file: "IMG_7277.JPG" },
  { file: "IMG_7283.JPG" },
  { file: "IMG_7329.JPG" },
  { file: "IMG_7366.JPG" },
  { file: "IMG_7332.JPG" },
];

const galleryItem: GalleryItem[] = walmartImageFiles.map(({ file, caption }, i) => ({
  id: file.replace(/\.[^.]+$/, ""),
  url: `/images/walmart/${file}`,
  alt: `Photograph ${i + 1} of ${walmartImageFiles.length} from 12 hours in Walmart, Midland Michigan`,
  caption,
  wrapperClass: "w-full",
  imgClass: "w-full h-auto object-cover",
}));

const risographItem: GalleryItem[] = [
  {
    id: "risograph-1",
    url: "/images/project-images/12-hours.gif",
    alt: "Risograph 1",
    wrapperClass: "w-full",
    imgClass: "w-full h-full object-cover",
    width: 600,
    height: 600,
    caption: "risograph book, with the interviews, 2021",
    captionClassName:
      "mt-2 text-xs font-fe leading-snug text-[var(--foreground)]",
  },
  {
    id: "lisa-feedback",
    url: "/images/walmart/lisa-feedback.png",
    alt: "Email from professor Lisa Anne Auerbach with final project feedback for 12 Hours in Walmart",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-contain",
    width: 1186,
    height: 1050,
    caption:
      "here was the feedback from my professor, that year. I did alright in the class, this actually being my only A. The website linked here isn't the right medium, of course, that was the whole point, but if you have the chance you should read through a few stories <3",
    captionClassName:
      "mt-2 text-xs font-fe leading-snug text-[var(--foreground)]",
  },
];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

const inlineLinkClass =
  "underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function WalmartPage() {
  return (
    <div className="min-h-screen px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
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
              12 hours in walmart 
            </h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p>
                2018. Midland, Michigan
                <br />
                photo-interview project
                <br /><br />
                one of my favorite and most formative projects to this day: fourteen interviews, 8:00 PM to 8:00 AM in Walmart. 
                <br/> <br />
                * read the interviews{" "}
                <a
                  href="https://gracejieyi.wixsite.com/home/walmartinterviews"
                  className={inlineLinkClass}
                >
                  here
                </a>
                <br />
                * made into a risograph publication later in 2021
                <br/><br/>I went into walmart with my mom's DSLR, my brother (mom did not trust me there alone) and a few prewritten questions. I recorded the conversations, and transcribed them into a website
                at first, leaving the project dormant for a while. Years later did I finally found the right medium in a publication class in college, where I printed the interviews and stories with red and blue ink riso, printing 25 copies for a zine fair. 
                Only then did I feel the stories had a medium that let the person sit with enough attention for each one. 
               
              </p>
            </div>
          </div>
        </div>
        <ImageGallery items={risographItem} columns={1} gap={2} />
        <ImageGallery items={galleryItem} columns={3} gap={2} />
      </div>
    </div>
  );
}
