"use client";

import { useState, type ReactNode } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import BackgroundVideoBottomBar from "@/components/BackgroundVideoBottomBar";
import {
  backgroundVideos,
  type BackgroundVideoSource,
} from "@/content/backgroundVideos";
import { useBackgroundVideoPlaylist } from "@/hooks/useBackgroundVideoPlaylist";

export default function GridShellWithVideo({
  children,
  sources = backgroundVideos,
}: {
  children: ReactNode;
  sources?: BackgroundVideoSource[];
}) {
  const { currentVideo, handleShuffle } = useBackgroundVideoPlaylist(sources);
  const [videoMuted, setVideoMuted] = useState(true);

  return (
    <>
      <BackgroundVideo source={currentVideo} muted={videoMuted} />
      <div className="relative z-10 min-h-screen w-full">{children}</div>
      <BackgroundVideoBottomBar
        currentVideo={currentVideo}
        videoMuted={videoMuted}
        onVideoMutedChange={setVideoMuted}
        onTeleport={handleShuffle}
      />
    </>
  );
}
