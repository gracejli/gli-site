"use client";

import React, { useRef, useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import BackgroundVideoBottomBar from "@/components/BackgroundVideoBottomBar";
import {
  GUESTBOOK_URL,
  backgroundVideos as defaultBackgroundVideos,
  type BackgroundVideoSource,
} from "@/content/backgroundVideos";
import { useBackgroundVideoPlaylist } from "@/hooks/useBackgroundVideoPlaylist";

const DIALOG_FLOW = {
  initial: {
    title: "hello user!",
    message:
      "this pop up only happens if you've clicked 5times in thirty seconds. scientists call this the threshold for doomscrolling.",
    buttons: [
      { label: "really?", action: "notReally" as const },
      { label: "i just wanted to see them all", nextStep: "seeAllResponse" as const },
    ],
  },
  notReally: {
    title: "jk",
    message:
      "no, i actually just made that up. lol. but you are doomscrolling precious, slow moments. so i wanted to say something.",
    buttons: [
      { label: "ill slow down", action: "close" as const },
      { label: "i just wanted to see them all!", nextStep: "seeAllResponse" as const },
    ],
  },
  seeAllResponse: {
    title: "i understand",
    message:
      "that's okay. i understand. I only have 20 videos anyways! someday ill add more. thanks for staying here with me.",
    buttons: [
      { label: "leave me a note in the guestbook", action: "openGuestbook" as const },
      { label: "close", action: "close" as const },
    ],
  },
} as const;

type DialogStep = keyof typeof DIALOG_FLOW;
type DialogOption = (typeof DIALOG_FLOW)[DialogStep]["buttons"][number];

const TELEPORT_CLICK_WINDOW_MS = 30_000;
const TELEPORT_CLICK_THRESHOLD = 5;
const TELEPORT_SLOW_DOWN_SESSION_KEY = "gli-teleport-slow-down-shown";

export type BackgroundVideoLayoutProps = {
  header: React.ReactNode;
  main: React.ReactNode;
  /**
   * Home overlay toggled by the eye. On blog/work, omit and set `eyeTogglesMain` so the eye hides `main` instead.
   */
  toggleableContent?: React.ReactNode;
  /** When true, the eye hides `main` (blog, work, etc.). When false, the eye only toggles `toggleableContent` (home). */
  eyeTogglesMain?: boolean;
  /** Classes on the wrapper around `toggleableContent` (e.g. page padding). */
  toggleableWrapperClassName?: string;
  /** Defaults to `backgroundVideos` from content. */
  sources?: BackgroundVideoSource[];
  /**
   * When true, rapid teleport clicks open the “slow down” dialog (homepage behavior).
   */
  teleportWithSlowdown?: boolean;
  /** Hover text for the “i” info chip. */
  infoTooltipText?: string;
  /** Outer class for the scrollable layer above the video (e.g. min-h-screen). */
  contentClassName?: string;
};

export default function BackgroundVideoLayout({
  header,
  main,
  toggleableContent,
  eyeTogglesMain = false,
  toggleableWrapperClassName = "",
  sources = defaultBackgroundVideos,
  teleportWithSlowdown = false,
  infoTooltipText = "small, short videos that i've taken for years. here are some of my spaces",
  contentClassName = "relative z-10 min-h-screen w-full",
}: BackgroundVideoLayoutProps) {
  const [showText, setShowText] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showSlowDown, setShowSlowDown] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>("initial");
  const teleportClickTimesRef = useRef<number[]>([]);
  const slowDownShownFallbackRef = useRef(false);

  const { currentVideo, handleShuffle } = useBackgroundVideoPlaylist(sources);

  const handleTeleportClick = () => {
    if (teleportWithSlowdown) {
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
    }
    handleShuffle();
  };

  const handleDialogOptionClick = (option: DialogOption) => {
    if ("action" in option) {
      if (option.action === "close") {
        setShowSlowDown(false);
        return;
      }
      if (option.action === "openGuestbook") {
        window.open(GUESTBOOK_URL, "_blank", "noopener,noreferrer");
        setShowSlowDown(false);
        return;
      }
      setCurrentStep(option.action);
      return;
    }
    if ("nextStep" in option && option.nextStep) {
      setCurrentStep(option.nextStep);
    }
  };

  const stepData = DIALOG_FLOW[currentStep];
  const showEyeToggle = toggleableContent != null || eyeTogglesMain;
  const showMain = !eyeTogglesMain || showText;

  return (
    <>
      <BackgroundVideo source={currentVideo} muted={videoMuted} />
      <div className={contentClassName}>
        {header}
        {showMain ? main : null}

        {teleportWithSlowdown && showSlowDown ? (
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

        {toggleableContent != null && showEyeToggle && showText ? (
          <div className={toggleableWrapperClassName}>{toggleableContent}</div>
        ) : null}
      </div>

      <BackgroundVideoBottomBar
        currentVideo={currentVideo}
        videoMuted={videoMuted}
        onVideoMutedChange={setVideoMuted}
        onTeleport={handleTeleportClick}
        showEyeToggle={showEyeToggle}
        showText={showText}
        onShowTextChange={setShowText}
        infoTooltipText={infoTooltipText}
      />
    </>
  );
}
