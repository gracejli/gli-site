"use client";
import React, { useMemo, useState } from "react";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Nav";
import {
  backgroundVideos,
  type BackgroundVideoSource,
} from "@/content/backgroundVideos";

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }

    if (
      u.hostname.includes("youtube.com") &&
      (u.pathname === "/watch" || u.pathname === "/watch/")
    ) {
      return u.searchParams.get("v");
    }

    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/")[2] || null;
    }

    return null;
  } catch {
    return null;
  }
}

function BackgroundVideo({
  source,
}: {
  source: BackgroundVideoSource | null;
}) {
  if (!source) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-70">
        {source.type === "file" ? (
          <video
            className="h-full w-full object-cover"
            src={source.src}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}

        {source.type === "youtube" ? (
          <iframe
            className="h-full w-full object-cover scale-[1.3] origin-center"
            src={(() => {
              const id = getYouTubeId(source.url);
              if (!id) return "";
              const params = new URLSearchParams({
                autoplay: "1",
                mute: "1",
                controls: "0",
                loop: "1",
                playlist: id,
                modestbranding: "1",
                playsinline: "1",
              });
              return `https://www.youtube.com/embed/${id}?${params.toString()}`;
            })()}
            title={source.caption}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
          />
        ) : null}
      </div>

      {/* Soft vignette / gradient so content stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
    </div>
  );
}

export default function App() {
  const myImages = [
    "/images/2022-dorm-room.png",
    "/images/2025-los-feliz-room.png",
    "/images/2024-silverlake-room.png",
  ];

  const [currentIndex, setCurrentIndex] = useState<number | null>(
    backgroundVideos.length ? 0 : null,
  );

  const currentVideo = useMemo<BackgroundVideoSource | null>(() => {
    if (currentIndex === null) return null;
    return backgroundVideos[currentIndex] ?? null;
  }, [currentIndex]);

  const handleShuffle = () => {
    if (!backgroundVideos.length) return;

    if (backgroundVideos.length === 1) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      const prevIndex =
        prev === null || prev < 0 || prev >= backgroundVideos.length ? 0 : prev;

      let next = prevIndex;
      while (next === prevIndex) {
        next = Math.floor(Math.random() * backgroundVideos.length);
      }
      return next;
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8">
      <BackgroundVideo source={currentVideo} />
      <ShootingStarCursor />

      {/* Main Layout Container 
        - Flex row on medium screens and up (md:flex-row)
        - Stacked column on mobile (flex-col)
        - Centered with max-width
      */}
      <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 pointer-events-auto">
        {/* LEFT COLUMN: Bio & Carousel (60%) */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          {/* Bio Box */}
          <div className="p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 cursor-none text-left bg-black/40 backdrop-blur">
            <p className="text-lg font-bianzhidai mb-2">grace li</p>
            <p className="text-sm font-bold font-fe mb-2">
              tinkerer in los angeles, from a small town in michigan.
            </p>
            <p className="text-sm font-bold font-fe mb-2">
              currently: i'm technical artist at riot games working on making the
              game teamfight tactics as delightul as possible for players
            </p>
            <p className="text-sm font-bold font-fe mb-2">
              previously: at microsoft and at columbia records. b.a. in computer
              science and art from pomona college
            </p>
            <p className="text-sm font-bold font-febold mt-4 ">
              welcome to my internet room
            </p>
          </div>

          {/* Carousel Section
          <div className="flex flex-col items-center">
            <Carousel images={myImages} />
            <p className="text-sm font-fe mt-2">my bedroom over the years</p>
          </div> */}
        </div>

        {/* RIGHT COLUMN: Site Nav + Links (40%) */}
        <div className="w-full md:w-[40%] flex flex-col h-full gap-4">
          {/* Site navigation box */}
          <div className="p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 bg-black/40 backdrop-blur">
            <h2 className="text-lg font-bold font-bianzhidai mb-4">internal</h2>
            <div className="font-rasterGrotesk text-sm">
              <Navbar />
            </div>
          </div>

          {/* External links box */}
          <div className="h-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 bg-black/40 backdrop-blur">
            <h2 className="text-lg font-bold font-bianzhidai mb-4">external</h2>
            <ul className="space-y-2 font-fe text-sm font-bold">
              <li>
                <a
                  href="https://www.are.na/gli/index"
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  are.na
                </a>
              </li>
              <li>
                <a
                  href="https://docs.google.com/document/d/1WdBJDExZ1Qv5_9O9CWMckTeZ0aHClaSxNFT-jAPfEQk/edit?tab=t.0"
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  my google doc cv
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/gracejli/"
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  some of my favorite photos
                </a>
              </li>
              <li>
                <a
                  href="https://www.yourworldoftext.com/%7Egracejli/"
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  guestbook
                </a>
              </li>
              <li>
                <a
                  href="https://www.gracejli.com"
                  className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                >
                  my old, currently live project website
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom-right shuffle + caption */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-20 flex max-w-xs flex-col items-end gap-2 text-right">
        {currentVideo ? (
          <p className="pointer-events-none text-xs font-fe text-amber-100/80 drop-shadow">
            {currentVideo.caption}
          </p>
        ) : null}

        <div className="pointer-events-auto flex items-center gap-2">
        <div className="group relative flex h-6 w-6 items-center justify-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-[10px] font-fe text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black">
              i
            </div>
            <div className="pointer-events-none absolute bottom-7 right-0 w-52 translate-y-1 rounded-lg border border-amber-200/60 bg-black/90 p-3 text-left text-[11px] font-fe leading-snug text-amber-50 opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover:translate-y-0 group-hover:opacity-100">
              i have so many videos of 5 second moments of where i've been. here are some of these space <3
            </div>
          </div>
          <button
            type="button"
            onClick={handleShuffle}
            className="rounded-full border border-amber-300/70 bg-black/60 px-4 py-1 text-xs font-fe uppercase tracking-wide text-amber-100 shadow-lg backdrop-blur transition hover:bg-amber-400/80 hover:text-black"
          >
            shuffle background
          </button>
        </div>
      </div>
    </main>
  );
}