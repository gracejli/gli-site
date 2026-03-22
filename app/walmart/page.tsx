import Link from "next/link";
import ImageGallery, { PortfolioItem } from "@/components/image-gallery";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    alt: "Project on a laptop",
    wrapperClass:
      "bg-[#facc15] w-full p-12 md:p-24 flex items-center justify-center",
    imgClass: "w-full max-w-3xl shadow-2xl rounded-sm",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    alt: "Pixel art buildings pattern",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=1200",
    alt: "Code and tech",
    wrapperClass: "w-full",
    imgClass: "w-full h-auto object-cover",
  },
];

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

export default function WalmartPage() {
  return (
    <div className="min-h-screen background px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
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
            <h1 className="text-lg font-bold font-bianzhidai mb-6">
              12 hours in walmart 
            </h1>

            <div className="space-y-6 text-[15px] leading-relaxed max-w-md font-fe">
              <p>
                Midland, Michigan
                <br />
                photo-interview project
                <br /><br />
                one of my favorite and most formative projects to this day: fourteen interviews, 8:00 PM to 8:00 AM in Walmart.
                <br />
                * read the interviews here
                <br />
                * made into a risograph publication later in 2021
              </p>
            </div>
          </div>

          <div className="text-[15px] leading-relaxed max-w-md mt-12 md:mt-16 font-fe opacity-90">
            <p>
              this project was created when I felt really stuck in a small town in michigan, and felt like there weren't enough stories, or things that I 
              was interested in. seeing the new york street interviews really inspired me to look around. 
              it was so formative it ended up being my college essay.
            </p>
          </div>
        </div>

        <ImageGallery items={portfolioItems} />
      </div>
    </div>
  );
}
