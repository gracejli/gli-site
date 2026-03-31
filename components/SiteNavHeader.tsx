"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { usePathname } from "next/navigation";

const SCROLL_THRESHOLD_PX = 8;

export default function SiteNavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <div className="relative px-8 pb-4 pt-6 md:px-12 md:pb-5 md:pt-8">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 min-h-[calc(100%+4rem)] transition-opacity duration-500 ease-out md:min-h-[calc(100%+5rem)] ${
            scrolled ? "opacity-100" : isHome ? "opacity-100 md:opacity-0" : "opacity-0"
          }`}
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0.46) 0%,
              rgba(0,0,0,0.34) 14%,
              rgba(0,0,0,0.22) 30%,
              rgba(0,0,0,0.12) 48%,
              rgba(0,0,0,0.05) 65%,
              rgba(0,0,0,0.015) 82%,
              transparent 100%
            )`,
          }}
        />
        <div className="relative pointer-events-auto w-full max-w-3xl">
          <Nav />
        </div>
      </div>
    </header>
  );
}
