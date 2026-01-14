import Link from "next/link";

// NAVIGATION BAR/COMPONENT

export default function Nav() {
  return (
    <nav className="flex flex-col gap-2">
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/">
        home
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/blog">
        brainforest
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/projects">
        my projects
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/links">
        awesome links
      </Link>
      
    </nav>
  );
}
