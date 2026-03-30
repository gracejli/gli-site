"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "home", href: "/" },
  { name: "microblog", href: "/blog" },
  { name: "work", href: "/work" },
];

function isNavActive(pathname: string, href: string) {
  const p =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  if (href === "/") return p === "/" || p === "";
  return p === href || p.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full" aria-label="Site">
      <ul className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-md font-rasterGrotesk">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`underline underline-offset-2 transition-all duration-200 ${
                  active
                    ? "text-white drop-shadow-[0_0_12px_rgba(253,224,71,0.95)]"
                    : "hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
