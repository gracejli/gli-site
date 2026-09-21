"use client";

import { useLayoutEffect, type ReactNode } from "react";
import SiteNavHeader from "@/components/SiteNavHeader";
import GridShellWithVideo from "@/components/GridShellWithVideo";
import BackgroundVideoLayout from "@/components/BackgroundVideoLayout";
import HomeToggleableIntro from "@/components/HomeToggleableIntro";
import MobileNotOptimizedScreen from "@/components/MobileNotOptimizedScreen";
import { usePathname } from "next/navigation";

const FULL_BLEED_BODY_CLASSES = [
  "md:h-dvh",
  "md:max-h-dvh",
  "md:overflow-hidden",
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const mobileWarningRoutes = ["/", "/blog", "/work"] as const;
  const usesUnifiedVideoShell =
    pathname === "/" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/work" ||
    pathname.startsWith("/work/") ||
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/");
  const fullBleedPrefixes = [
    "/walmart",
    "/triumvirate",
    "/shiny-objects",
    "/dorm-room-vr",
    "/odinspassage",
    "/ghost-town",
    "/email-signoffs",
    "/flickr-surf",
  ] as const;
  const noNavPrefixes = [...fullBleedPrefixes, "/arena-channels", "/posty"] as const;
  const isFullBleedGallery = fullBleedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isNoNavRoute = noNavPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const shouldShowMobileWarning = mobileWarningRoutes.includes(
    pathname as (typeof mobileWarningRoutes)[number],
  );
  const isWalmart =
    pathname === "/walmart" || pathname.startsWith("/walmart/");

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isWalmart) html.setAttribute("data-page-theme", "walmart");
    else html.removeAttribute("data-page-theme");

    for (const className of FULL_BLEED_BODY_CLASSES) {
      body.classList.toggle(className, isFullBleedGallery);
    }

    return () => {
      html.removeAttribute("data-page-theme");
      for (const className of FULL_BLEED_BODY_CLASSES) {
        body.classList.remove(className);
      }
    };
  }, [isWalmart, isFullBleedGallery]);

  if (isNoNavRoute) {
    return (
      <>
        {shouldShowMobileWarning ? <MobileNotOptimizedScreen /> : null}
        <div>{children}</div>
      </>
    );
  }

  if (usesUnifiedVideoShell) {
    return (
      <>
        {shouldShowMobileWarning ? <MobileNotOptimizedScreen /> : null}
        <div>
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
            header={<SiteNavHeader />}
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
        </div>
      </>
    );
  }

  return (
    <>
      {shouldShowMobileWarning ? <MobileNotOptimizedScreen /> : null}
      <div>
        <GridShellWithVideo>
          <SiteNavHeader />
          <div className="mx-auto max-w-[1400px] px-8 md:px-12">
            <main className="pt-20 pb-8 md:pt-24 md:pb-12">{children}</main>
          </div>
        </GridShellWithVideo>
      </div>
    </>
  );
}
