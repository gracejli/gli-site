"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import type { BackgroundVideoSource } from "@/content/backgroundVideos";

export function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deterministic first paint so SSR and hydration match; random start runs in useLayoutEffect. */
function getHydrationSafeInitialState(sources: BackgroundVideoSource[]): {
  currentIndex: number | null;
  remaining: number[];
} {
  if (!sources.length) {
    return { currentIndex: null, remaining: [] };
  }
  if (sources.length === 1) {
    return { currentIndex: 0, remaining: [] };
  }
  return {
    currentIndex: 0,
    remaining: sources.map((_, i) => i).filter((i) => i !== 0),
  };
}

export function useBackgroundVideoPlaylist(sources: BackgroundVideoSource[]) {
  const [bgState, setBgState] = useState<{
    currentIndex: number | null;
    remaining: number[];
  }>(() => getHydrationSafeInitialState(sources));

  useLayoutEffect(() => {
    if (!sources.length || sources.length === 1) return;
    setBgState(() => {
      const currentIndex = Math.floor(Math.random() * sources.length);
      const remaining = shuffled(
        sources.map((_, i) => i).filter((i) => i !== currentIndex),
      );
      return { currentIndex, remaining };
    });
  }, [sources]);

  const currentVideo = useMemo<BackgroundVideoSource | null>(() => {
    if (bgState.currentIndex === null) return null;
    return sources[bgState.currentIndex] ?? null;
  }, [bgState.currentIndex, sources]);

  const handleShuffle = useCallback(() => {
    if (!sources.length) return;

    if (sources.length === 1) {
      setBgState({ currentIndex: 0, remaining: [] });
      return;
    }

    setBgState((prev) => {
      const currentIndex =
        prev.currentIndex === null ||
        prev.currentIndex < 0 ||
        prev.currentIndex >= sources.length
          ? 0
          : prev.currentIndex;

      let remaining = prev.remaining.filter(
        (i) => i >= 0 && i < sources.length && i !== currentIndex,
      );

      if (remaining.length === 0) {
        remaining = shuffled(
          sources.map((_, i) => i).filter((i) => i !== currentIndex),
        );
      }

      const [next, ...rest] = remaining;
      return { currentIndex: next ?? currentIndex, remaining: rest };
    });
  }, [sources]);

  return { currentVideo, handleShuffle };
}
