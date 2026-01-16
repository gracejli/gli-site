import Link from "next/link";

// NAVIGATION BAR/COMPONENT

export default function Nav() {
  return (
    <nav className="flex flex-col gap-2">
      <Link className="underline underline-offset-4 font-rasterGrotesk font-lg 
      transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/">
        grace li
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk
      transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/blog">
        blog
      </Link>
    </nav>
  );
}
/*

      <Link className="underline underline-offset-4 font-rasterGrotesk
      transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/projects">
        my projects
      </Link>


      <Link className="underline underline-offset-4 font-rasterGrotesk
      transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" href="/links">
        awesome links
      </Link>
*/