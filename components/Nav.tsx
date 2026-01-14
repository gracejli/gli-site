import Link from "next/link";

// NAVIGATION BAR/COMPONENT

export default function Nav() {
  return (
    <nav className="flex flex-col gap-2">
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/">
        home
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/blog">
        blog
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/links">
        links
      </Link>
      <Link className="underline underline-offset-4 font-rasterGrotesk" href="/projects">
        projects
      </Link>
    </nav>
  );
}
