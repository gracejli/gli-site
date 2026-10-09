"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
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

function youtubePosterUrl(id: string, quality: "maxres" | "hq") {
  return quality === "maxres"
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function isAutomatedBrowser(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.webdriver);
}

const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;
const EMBED_FAIL_MS = 4_000;
const BACKGROUND_VOLUME = 0.5;

type YoutubePlayerInstance = {
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
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
            onError?: (e: { data: number }) => void;
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
  const youtubeMountRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YoutubePlayerInstance | null>(null);
  const fileVideoRef = useRef<HTMLVideoElement>(null);
  const mutedRef = useRef(muted);
  const canPlaySoundRef = useRef(false);

  const teardownYoutubePlayer = useCallback(() => {
    try {
      youtubePlayerRef.current?.destroy();
    } catch {
      /* YouTube may have already swapped or removed the iframe. */
    }
    youtubePlayerRef.current = null;
    youtubeMountRef.current?.replaceChildren();
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);
  const [allowYoutubeEmbed, setAllowYoutubeEmbed] = useState(false);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [embedPlaying, setEmbedPlaying] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    canPlaySoundRef.current = canPlaySound;
  }, [canPlaySound]);

  const applyYoutubeAudio = useCallback(
    (player: YoutubePlayerInstance) => {
      // mute/setVolume/playVideo are not on YT.Player at construction. YouTube
      // copies them on after the iframe's initialDelivery message. Calling them
      // earlier throws "setVolume is not a function".
      if (
        typeof player.setVolume !== "function" ||
        typeof player.mute !== "function" ||
        typeof player.unMute !== "function"
      ) {
        return;
      }
      try {
        player.setVolume(Math.round(BACKGROUND_VOLUME * 100));
        if (muted || !canPlaySound) player.mute();
        else player.unMute();
      } catch {
        /* Iframe can be mid-swap when mute state changes. */
      }
    },
    [canPlaySound, muted],
  );
  const applyYoutubeAudioRef = useRef(applyYoutubeAudio);
  applyYoutubeAudioRef.current = applyYoutubeAudio;

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

  useEffect(() => {
    if (allowYoutubeEmbed || isAutomatedBrowser()) return;

    const enable = () => setAllowYoutubeEmbed(true);
    let lastX: number | null = null;
    let lastY: number | null = null;
    const onPointerMove = (e: PointerEvent) => {
      if (lastX !== null && lastY !== null) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (dx * dx + dy * dy >= 4) enable();
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", enable);
    window.addEventListener("touchstart", enable, { passive: true });
    window.addEventListener("keydown", enable);
    window.addEventListener("scroll", enable, { passive: true, capture: true });
    window.addEventListener("wheel", enable, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", enable, true);
      window.removeEventListener("wheel", enable);
    };
  }, [allowYoutubeEmbed]);

  useEffect(() => {
    if (canPlaySound) return;

    const enableSound = () => setCanPlaySound(true);
    window.addEventListener("pointerdown", enableSound);
    window.addEventListener("touchstart", enableSound, { passive: true });
    window.addEventListener("keydown", enableSound);

    return () => {
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("touchstart", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, [canPlaySound]);

  const youtubeUrl = source?.type === "youtube" ? source.url : null;
  const youtubeId = youtubeUrl ? getYouTubeId(youtubeUrl) : null;

  useEffect(() => {
    setEmbedPlaying(false);
    setEmbedFailed(false);
    setPosterUrl(youtubeId ? youtubePosterUrl(youtubeId, "maxres") : null);
    if (youtubeId && isAutomatedBrowser()) setEmbedFailed(true);
  }, [youtubeId]);

  const handlePosterLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!youtubeId) return;
    if (e.currentTarget.naturalWidth < 200) {
      setPosterUrl(youtubePosterUrl(youtubeId, "hq"));
    }
  };

  const handlePosterError = () => {
    if (!youtubeId) return;
    setPosterUrl((current) =>
      current?.includes("maxresdefault")
        ? youtubePosterUrl(youtubeId, "hq")
        : current,
    );
  };

  useLayoutEffect(() => {
    if (!youtubeUrl || !youtubeId || !isDesktop || !allowYoutubeEmbed) {
      teardownYoutubePlayer();
      return;
    }

    let cancelled = false;
    setEmbedPlaying(false);
    setEmbedFailed(false);

    const markFailed = () => {
      if (cancelled) return;
      teardownYoutubePlayer();
      setEmbedPlaying(false);
      setEmbedFailed(true);
    };

    const failTimer = window.setTimeout(markFailed, EMBED_FAIL_MS);

    void ensureYoutubeIframeApi().then(() => {
      const mount = youtubeMountRef.current;
      if (cancelled || !mount || !window.YT?.Player) {
        markFailed();
        return;
      }

      teardownYoutubePlayer();
      const host = document.createElement("div");
      host.style.width = "100%";
      host.style.height = "100%";
      mount.appendChild(host);

      const player = new window.YT.Player(host, {
        height: "100%",
        width: "100%",
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          mute: mutedRef.current || !canPlaySoundRef.current ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: youtubeId,
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
            applyYoutubeAudioRef.current(e.target);
            try {
              e.target.playVideo();
            } catch {
              /* Autoplay can be blocked until mute settles */
            }
          },
          onStateChange: (e) => {
            if (cancelled) return;
            if (e.data === YT_PLAYING) {
              window.clearTimeout(failTimer);
              setEmbedFailed(false);
              setEmbedPlaying(true);
              applyYoutubeAudioRef.current(e.target);
              return;
            }
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
          onError: () => {
            window.clearTimeout(failTimer);
            markFailed();
          },
        },
      });

      youtubePlayerRef.current = player;
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      teardownYoutubePlayer();
    };
  }, [
    allowYoutubeEmbed,
    isDesktop,
    teardownYoutubePlayer,
    youtubeId,
    youtubeUrl,
  ]);

  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (source?.type !== "youtube" || !player) return;
    applyYoutubeAudio(player);
  }, [applyYoutubeAudio, source?.type]);

  useEffect(() => {
    const video = fileVideoRef.current;
    if (!video || source?.type !== "file") return;
    video.volume = BACKGROUND_VOLUME;
    video.muted = muted || !canPlaySound;
    void video.play().catch(() => {
      /* Autoplay can be blocked until a click/key */
    });
  }, [canPlaySound, muted, source]);

  if (!source || !isDesktop) return null;

  const showYoutubePoster =
    source.type === "youtube" && embedFailed && Boolean(posterUrl);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-60">
        {source.type === "file" ? (
          <video
            ref={fileVideoRef}
            className="h-full w-full object-cover"
            src={source.src}
            autoPlay
            muted={muted || !canPlaySound}
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.volume = BACKGROUND_VOLUME;
            }}
          />
        ) : null}

        {source.type === "youtube" ? (
          <div
            className="relative h-full w-full origin-center scale-[4] object-cover md:scale-[1.3]"
            title={source.caption}
          >
            <div
              ref={youtubeMountRef}
              className={
                embedPlaying
                  ? "h-full w-full [&_iframe]:pointer-events-none [&_iframe]:select-none"
                  : "h-full w-full opacity-0 [&_iframe]:pointer-events-none [&_iframe]:select-none"
              }
            />
            {showYoutubePoster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl ?? undefined}
                alt=""
                onLoad={handlePosterLoad}
                onError={handlePosterError}
                className="absolute inset-0 z-[2] h-full w-full object-cover"
              />
            ) : null}
            {/* Block pointer/focus from reaching the embed (prevents YouTube’s center controls). */}
            <div
              className="pointer-events-auto absolute inset-0 z-[3]"
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
