import Link from "next/link";

// NAVIGATION BAR/COMPONENT

export default function Nav() {
  return (
    <nav className="flex flex-col gap-2">
      <Link className="underline underline-offset-4" href="/">
        home
      </Link>
      <Link className="underline underline-offset-4" href="/blog">
        blog
      </Link>
      <Link className="underline underline-offset-4" href="/links">
        links
      </Link>
    </nav>
  );
}
