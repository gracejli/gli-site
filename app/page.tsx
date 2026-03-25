"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import Navbar from "@/components/Nav";
import {
  backgroundVideos,
  type BackgroundVideoSource,
} from "@/content/backgroundVideos";

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 1. Define the dialogue flow outside the component.
// You can easily add more steps, endings, or secret paths here!
const DIALOG_FLOW = {
  initial: {
    title: "slow down!!!",
    message: "you just clicked five times in 10 seconds. you are doomscrolling my life. its ok. we're conditioned to do that. stay a little!",
    buttons: [
      { label: "ill slow down :)", action: "close" },
      { label: "i just wanted to see them all!", nextStep: "seeAllResponse" },
    ],
  },
  seeAllResponse: {
    title: "whoa, ambitious!",
    message: "that's okay. i understand. I only have 30 videos anyways. thanks for staying here with me.",
    buttons: [
      { label: "leave me a note in the guestbook", action: "close" },
      { label: "wait, go back", nextStep: "initial" },
    ],
  },
} as const;

type DialogStep = keyof typeof DIALOG_FLOW;
type DialogOption = (typeof DIALOG_FLOW)[DialogStep]["buttons"][number];

const TELEPORT_CLICK_WINDOW_MS = 30_000;
const TELEPORT_CLICK_THRESHOLD = 5;
const TELEPORT_SLOW_DOWN_SESSION_KEY = "gli-teleport-slow-down-shown";

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

function postYoutubeMuteCommand(
  iframe: HTMLIFrameElement | null,
  muted: boolean,
) {
  const w = iframe?.contentWindow;
  if (!w) return;
  const func = muted ? "mute" : "unMute";
  w.postMessage(JSON.stringify({ event: "command", func, args: "" }), "*");
}

function BackgroundVideo({
  source,
  muted,
}: {
  source: BackgroundVideoSource | null;
  muted: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const applyYoutubeMute = useCallback(() => {
    postYoutubeMuteCommand(iframeRef.current, muted);
  }, [muted]);

  useEffect(() => {
    if (source?.type !== "youtube") return;
    applyYoutubeMute();
  }, [applyYoutubeMute, source?.type, source]);

  if (!source) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-70">
        {source.type === "file" ? (
          <video
            className="h-full w-full object-cover"
            src={source.src}
            autoPlay
            muted={muted}
            loop
            playsInline
          />
        ) : null}

        {source.type === "youtube" ? (
          <iframe
            ref={iframeRef}
            className="h-full w-full origin-center object-cover scale-[4] md:scale-[1.3]"
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
                enablejsapi: "1",
              });
              return `https://www.youtube.com/embed/${id}?${params.toString()}`;
            })()}
            title={source.caption}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            onLoad={applyYoutubeMute}
          />
        ) : null}
      </div>

      {/* Soft vignette / gradient so content stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
    </div>
  );
}

function EyeIcon({ slashed }: { slashed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {slashed ? (
        <>
          <path d="M10.733 5.076A10.744 10.744 0 0 1 12 5c7 0 10 7 10 7a17.8 17.8 0 0 1-1.67 2.73" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
          <path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {muted ? (
        <>
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

export default function App() {
  const [showText, setShowText] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showSlowDown, setShowSlowDown] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>("initial");
  const teleportClickTimesRef = useRef<number[]>([]);
  const slowDownShownFallbackRef = useRef(false);

  const [bgState, setBgState] = useState<{
    currentIndex: number | null;
    remaining: number[];
  }>(() => {
    if (!backgroundVideos.length) {
      return { currentIndex: null, remaining: [] };
    }

    const currentIndex = 0;
    const remaining = shuffled(
      backgroundVideos.map((_, i) => i).filter((i) => i !== currentIndex),
    );

    return { currentIndex, remaining };
  });

  const currentVideo = useMemo<BackgroundVideoSource | null>(() => {
    if (bgState.currentIndex === null) return null;
    return backgroundVideos[bgState.currentIndex] ?? null;
  }, [bgState.currentIndex]);

  const handleShuffle = () => {
    if (!backgroundVideos.length) return;

    if (backgroundVideos.length === 1) {
      setBgState({ currentIndex: 0, remaining: [] });
      return;
    }

    setBgState((prev) => {
      const currentIndex =
        prev.currentIndex === null ||
        prev.currentIndex < 0 ||
        prev.currentIndex >= backgroundVideos.length
          ? 0
          : prev.currentIndex;

      let remaining = prev.remaining.filter(
        (i) => i >= 0 && i < backgroundVideos.length && i !== currentIndex,
      );

      if (remaining.length === 0) {
        remaining = shuffled(
          backgroundVideos.map((_, i) => i).filter((i) => i !== currentIndex),
        );
      }

      const [next, ...rest] = remaining;
      return { currentIndex: next ?? currentIndex, remaining: rest };
    });
  };

  const handleTeleportClick = () => {
    const now = Date.now();
    const recent = teleportClickTimesRef.current.filter(
      (t) => now - t < TELEPORT_CLICK_WINDOW_MS,
    );
    recent.push(now);
    teleportClickTimesRef.current = recent;
    if (recent.length > TELEPORT_CLICK_THRESHOLD) {
      let alreadyShown = slowDownShownFallbackRef.current;
      try {
        alreadyShown =
          alreadyShown ||
          !!sessionStorage.getItem(TELEPORT_SLOW_DOWN_SESSION_KEY);
      } catch {
        /* private mode / storage blocked */
      }
      if (!alreadyShown) {
        slowDownShownFallbackRef.current = true;
        try {
          sessionStorage.setItem(TELEPORT_SLOW_DOWN_SESSION_KEY, "1");
        } catch {
          /* ref already prevents repeat */
        }
        setCurrentStep("initial");
        setShowSlowDown(true);
      }
    }
    handleShuffle();
  };

  const handleDialogOptionClick = (option: DialogOption) => {
    if ("action" in option && option.action === "close") {
      setShowSlowDown(false);
    } else if ("nextStep" in option && option.nextStep) {
      setCurrentStep(option.nextStep);
    }
  };

  const stepData = DIALOG_FLOW[currentStep];

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8 md:bg-transparent">
      <BackgroundVideo source={currentVideo} muted={videoMuted} />
      <ShootingStarCursor />

      {/* 4. The Dynamic Popup */}
      {showSlowDown ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="slow-down-title"
        >
          <div className="w-full max-w-md rounded-xl border-2 border-dashed border-amber-300/80 bg-black/90 p-8 text-center shadow-xl transition-all">
            <p
              id="slow-down-title"
              className="font-fe text-lg font-bold leading-relaxed text-amber-100 mb-4"
            >
              {stepData.title}
            </p>
            <p className="font-fe text-sm text-amber-100/80 mb-8 leading-relaxed">
              {stepData.message}
            </p>

            <div className="flex flex-row items-center justify-center gap-3">
              {stepData.buttons.map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDialogOptionClick(btn)}
                  className="rounded-full border border-amber-300/70 bg-amber-400/20 px-5 py-3 text-xs font-fe font-bold uppercase tracking-wide transition hover:bg-amber-400/80 hover:text-black"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Layout Container 
        - Flex row on medium screens and up (md:flex-row)
        - Stacked column on mobile (flex-col)
        - Centered with max-width
      */}
      {showText ? (
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
      ) : null}

      {/* Bottom-right shuffle + caption */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-20 flex max-w-[min(20rem,calc(100vw-2rem))] flex-col items-end gap-2 text-right">
        {currentVideo ? (
          <p className="pointer-events-none text-xs font-fe text-amber-100/80 drop-shadow">
            {currentVideo.caption}
          </p>
        ) : null}

        <div className="pointer-events-auto flex items-center gap-2">
          {currentVideo ? (
            <div className="group relative flex h-6 w-6 items-center justify-center">
              <button
                type="button"
                onClick={() => setVideoMuted((m) => !m)}
                aria-pressed={!videoMuted}
                aria-label={videoMuted ? "Unmute background video" : "Mute background video"}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black"
              >
                <VolumeIcon muted={videoMuted} />
              </button>
            </div>
          ) : null}

          <div className="group relative flex h-6 w-6 items-center justify-center">
            <button
              type="button"
              onClick={() => setShowText((v) => !v)}
              aria-pressed={!showText}
              aria-label={showText ? "Hide text" : "Show text"}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black"
            >
              <EyeIcon slashed={!showText} />
            </button>
            {/* <div className="pointer-events-none absolute bottom-7 right-0 w-24 translate-y-1 rounded-lg border border-amber-200/60 bg-black/90 p-2 text-left text-[11px] font-fe leading-snug text-amber-50 opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover:translate-y-0 group-hover:opacity-100">
              {showText ? "hide text" : "show text"}
            </div> */}
          </div>

          <div className="group relative flex h-6 w-6 items-center justify-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-[10px] font-fe text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black">
              i
            </div>
            <div className="pointer-events-none absolute bottom-7 right-0 w-52 translate-y-1 rounded-lg border border-amber-200/60 bg-black/90 p-3 text-left text-[11px] font-fe leading-snug text-amber-50 opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover:translate-y-0 group-hover:opacity-100">
              small, short videos that i've taken for years. here are some of my spaces
            </div>
          </div>
          <button
            type="button"
            onClick={handleTeleportClick}
            className="rounded-full border border-amber-300/70 bg-black/60 px-4 py-1 text-xs font-fe uppercase tracking-wide text-amber-100 shadow-lg backdrop-blur transition hover:bg-amber-400/80 hover:text-black"
          >
            teleport!
          </button>
        </div>
      </div>
    </main>
  );
}