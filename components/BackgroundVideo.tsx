"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BackgroundVideoSource } from "@/content/backgroundVideos";

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

const YT_ENDED = 0;
const YT_PAUSED = 2;

type YoutubePlayerInstance = {
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
  playVideo: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          height?: string;
          width?: string;
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YoutubePlayerInstance }) => void;
            onStateChange?: (e: {
              data: number;
              target: YoutubePlayerInstance;
            }) => void;
          };
        },
      ) => YoutubePlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let iframeApiPromise: Promise<void> | null = null;

function ensureYoutubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!iframeApiPromise) {
    iframeApiPromise = new Promise((resolve) => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const first = document.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(tag, first);
      const prior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prior?.();
        resolve();
      };
    });
  }
  return iframeApiPromise;
}

export default function BackgroundVideo({
  source,
  muted,
}: {
  source: BackgroundVideoSource | null;
  muted: boolean;
}) {
  const youtubeHostRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YoutubePlayerInstance | null>(null);
  const mutedRef = useRef(muted);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => {
      mediaQuery.removeEventListener("change", updateIsDesktop);
    };
  }, []);

  const youtubeUrl =
    source?.type === "youtube" ? source.url : null;

  useEffect(() => {
    if (!youtubeUrl || !isDesktop) {
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
      return;
    }

    const id = getYouTubeId(youtubeUrl);
    if (!id) {
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
      return;
    }

    let cancelled = false;

    void ensureYoutubeIframeApi().then(() => {
      if (cancelled || !youtubeHostRef.current || !window.YT?.Player) return;

      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;

      const player = new window.YT.Player(youtubeHostRef.current, {
        height: "100%",
        width: "100%",
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: mutedRef.current ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: id,
          /** Hide fullscreen control */
          fs: 0,
          /** Hide keyboard shortcuts (can still surface UI on some clients) */
          disablekb: 1,
          iv_load_policy: 3,
          /** @deprecated but still honored by embed for chrome hiding */
          autohide: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            if (mutedRef.current) e.target.mute();
            else e.target.unMute();
          },
          onStateChange: (e) => {
            if (cancelled) return;
            // Loop/restart can hit ENDED or a flash of PAUSED; that surfaces YouTube’s
            // center controls even with controls=0. Resume immediately.
            if (e.data === YT_ENDED || e.data === YT_PAUSED) {
              queueMicrotask(() => {
                if (cancelled) return;
                try {
                  e.target.playVideo();
                } catch {
                  /* Player torn down before microtask ran */
                }
              });
            }
          },
        },
      });

      youtubePlayerRef.current = player;
    });

    return () => {
      cancelled = true;
      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
    };
  }, [isDesktop, youtubeUrl]);

  const syncYoutubeMute = useCallback(() => {
    const p = youtubePlayerRef.current;
    if (!p) return;
    if (muted) p.mute();
    else p.unMute();
  }, [muted]);

  useEffect(() => {
    if (source?.type !== "youtube") return;
    syncYoutubeMute();
  }, [source?.type, syncYoutubeMute]);

  if (!source || !isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-60">
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
          <div
            className="relative h-full w-full origin-center scale-[4] object-cover md:scale-[1.3]"
            title={source.caption}
          >
            <div
              ref={youtubeHostRef}
              className="h-full w-full [&_iframe]:pointer-events-none [&_iframe]:select-none"
            />
            {/* Block pointer/focus from reaching the embed (prevents YouTube’s center controls). */}
            <div
              className="pointer-events-auto absolute inset-0 z-[1]"
              aria-hidden
            />
          </div>
        ) : null}
      </div>

      {/* Soft blur patches: large play/pause center + small back/forward beside it */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/15 backdrop-blur-sm" />
        <div className="absolute left-[calc(50%-6.5rem)] top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/15 backdrop-blur-sm" />
        <div className="absolute left-[calc(50%+6.5rem)] top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 backdrop-blur-sm" />
      </div>

      {/* Soft vignette / gradient so content stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
    </div>
  );
}
