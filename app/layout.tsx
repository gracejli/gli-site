"use client";

import "@/app/styling/globals.css";
import Nav from "@/components/Nav";
import GridShellWithVideo from "@/components/GridShellWithVideo";
import BackgroundVideoLayout from "@/components/BackgroundVideoLayout";
import HomeToggleableIntro from "@/components/HomeToggleableIntro";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const usesUnifiedVideoShell =
    pathname === "/" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/work" ||
    pathname.startsWith("/work/");
  const fullBleedPrefixes = [
    "/walmart",
    "/triumvirate",
    "/shiny-objects",
    "/dorm-room-vr",
    "/odinspassage",
    "/ghost-town",
    "/email-signoffs",
  ] as const;
  const noNavPrefixes = [...fullBleedPrefixes, "/arena-channels"] as const;
  const isFullBleedGallery = fullBleedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isNoNavRoute = noNavPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isWalmart =
    pathname === "/walmart" || pathname.startsWith("/walmart/");

  if (isNoNavRoute) {
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

  if (usesUnifiedVideoShell) {
    return (
      <html lang="en" data-page-theme={isWalmart ? "walmart" : undefined}>
        <body className="min-h-screen w-full overflow-x-hidden font-serif">
          <BackgroundVideoLayout
            teleportWithSlowdown
            eyeTogglesMain={!isHome}
            toggleableContent={isHome ? <HomeToggleableIntro /> : undefined}
            contentClassName={
              isHome
                ? "relative z-10 h-dvh max-h-dvh w-full overflow-hidden"
                : "relative z-10 min-h-screen w-full"
            }
            toggleableWrapperClassName={
              isHome
                ? "absolute inset-0 flex flex-col items-center justify-center p-8 pt-20 md:pt-24 overflow-y-auto overscroll-y-contain md:overflow-hidden md:bg-transparent"
                : ""
            }
            header={
              <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-8 pt-6 md:px-12 md:pt-8">
                <div className="pointer-events-auto w-full max-w-3xl">
                  <Nav />
                </div>
              </header>
            }
            main={
              <div
                className={
                  isHome
                    ? "pointer-events-none absolute inset-0 mx-auto max-w-[1400px] px-8 md:px-12"
                    : "mx-auto max-w-[1400px] px-8 md:px-12"
                }
              >
                <main
                  className={
                    isHome
                      ? "h-full pt-20 pb-8 md:pt-24 md:pb-12"
                      : "pt-20 pb-8 md:pt-24 md:pb-12"
                  }
                >
                  {children}
                </main>
              </div>
            }
          />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-page-theme={isWalmart ? "walmart" : undefined}>
      <body className="min-h-screen w-full overflow-x-hidden font-serif">
        <GridShellWithVideo>
          <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-8 pt-6 md:px-12 md:pt-8">
            <div className="pointer-events-auto w-full max-w-3xl">
              <Nav />
            </div>
          </header>
          <div className="mx-auto max-w-[1400px] px-8 md:px-12">
            <main className="pt-20 pb-8 md:pt-24 md:pb-12">{children}</main>
          </div>
        </GridShellWithVideo>
      </body>
    </html>
  );
}
