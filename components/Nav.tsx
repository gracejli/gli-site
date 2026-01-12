import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex flex-col gap-2">
      <Link className="underline underline-offset-4" href="/">
        home
      </Link>
      <Link className="underline underline-offset-4" href="/blog">
        blog
      </Link>
    </nav>
  );
}
