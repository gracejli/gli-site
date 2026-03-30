"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

const SCROLL_THRESHOLD_PX = 8;

export default function SiteNavHeader() {
  const [scrolled, setScrolled] = useState(false);

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
          className={`pointer-events-none absolute left-0 top-0 h-[13rem] w-[min(36rem,92vw)] transition-opacity duration-500 ease-out md:h-[15rem] md:w-[min(42rem,94vw)] ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(
              ellipse 100% 88% at 0% 0%,
              rgba(0,0,0,0.48) 0%,
              rgba(0,0,0,0.24) 34%,
              rgba(0,0,0,0.09) 56%,
              rgba(0,0,0,0.02) 74%,
              transparent 92%
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
