"use client";

import { useCallback, useEffect, useRef } from "react";
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

function postYoutubeMuteCommand(
  iframe: HTMLIFrameElement | null,
  muted: boolean,
) {
  const w = iframe?.contentWindow;
  if (!w) return;
  const func = muted ? "mute" : "unMute";
  w.postMessage(JSON.stringify({ event: "command", func, args: "" }), "*");
}

export default function BackgroundVideo({
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
