"use client";

import "@/app/styling/globals.css";
import Nav from "@/components/Nav";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const fullBleedPrefixes = [
    "/walmart",
    "/triumvirate",
    "/shiny-objects",
    "/dorm-room-vr",
    "/odinspassage",
    "/ghost-town",
    "/email-signoffs",
  ] as const;
  const isFullBleedGallery = fullBleedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isWalmart =
    pathname === "/walmart" || pathname.startsWith("/walmart/");

  if (isHome || isFullBleedGallery) {
    return (
      <html lang="en" data-page-theme={isWalmart ? "walmart" : undefined}>
        <body
          className={
            isFullBleedGallery
              ? "min-h-screen w-full font-serif md:h-dvh md:max-h-dvh md:overflow-hidden"
              : "min-h-screen w-full overflow-x-hidden font-serif"
          }
        >
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-page-theme={isWalmart ? "walmart" : undefined}>
      <body className="max-w-[1400px] mx-auto px-8 md:px-12 font-serif">
        <div className="md:grid md:grid-cols-12 md:min-h-screen">
          <aside className="md:col-span-2 py-8 md:py-12 md:sticky md:top-12 self-start">
            <Nav />
          </aside>

          <main className="md:col-span-8 py-8 md:py-12">
            {children}
          </main>

          <div className="md:col-span-2" />
        </div>
      </body>
    </html>
  );
}
