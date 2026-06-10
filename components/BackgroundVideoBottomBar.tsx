"use client";

import type { BackgroundVideoSource } from "@/content/backgroundVideos";
import InfoChip from "@/components/InfoChip";

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

export type BackgroundVideoBottomBarProps = {
  currentVideo: BackgroundVideoSource | null;
  videoMuted: boolean;
  onVideoMutedChange: (muted: boolean) => void;
  onTeleport: () => void;
  showEyeToggle?: boolean;
  showText?: boolean;
  onShowTextChange?: (show: boolean) => void;
  infoTooltipText?: string;
};

export default function BackgroundVideoBottomBar({
  currentVideo,
  videoMuted,
  onVideoMutedChange,
  onTeleport,
  showEyeToggle = false,
  showText = true,
  onShowTextChange,
  infoTooltipText = "small, short videos that i've taken for years. here are some of my spaces",
}: BackgroundVideoBottomBarProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-20 hidden max-w-[min(20rem,calc(100vw-2rem))] flex-col items-end gap-2 text-right md:flex">
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
              onClick={() => onVideoMutedChange(!videoMuted)}
              aria-pressed={!videoMuted}
              aria-label={
                videoMuted ? "Unmute background video" : "Mute background video"
              }
              className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black"
            >
              <VolumeIcon muted={videoMuted} />
            </button>
          </div>
        ) : null}

        {showEyeToggle && onShowTextChange ? (
          <div className="group relative flex h-6 w-6 items-center justify-center">
            <button
              type="button"
              onClick={() => onShowTextChange(!showText)}
              aria-pressed={!showText}
              aria-label={showText ? "Hide text" : "Show text"}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black"
            >
              <EyeIcon slashed={!showText} />
            </button>
          </div>
        ) : null}

        <InfoChip text={infoTooltipText} placement="above" />
        <button
          type="button"
          onClick={onTeleport}
          className="rounded-full border border-amber-300/70 bg-black/60 px-4 py-1 text-xs font-fe uppercase tracking-wide text-amber-100 shadow-lg backdrop-blur transition hover:bg-amber-400/80 hover:text-black"
        >
          teleport!
        </button>
      </div>
    </div>
  );
}
