"use client";

import React from "react";

const CIRCLE_COLORS = ["#ef4444", "#3b82f6", "#eab308"] as const;
const R = 26;
const BASE = 24;

export type ColorStoryIndex = 0 | 1 | 2;

type Props = {
  themeIndex: ColorStoryIndex;
  onThemeIndexChange: (index: ColorStoryIndex) => void;
};

export default function ColorStoryPicker({
  themeIndex,
  onThemeIndexChange,
}: Props) {
  return (
    <div
      className="relative h-[4.5rem] w-[4.5rem] shrink-0"
      role="group"
      aria-label="Color story"
    >
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0 transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${-themeIndex * 120}deg)` }}
      >
        {([0, 1, 2] as const).map((i) => {
          const deg = -90 + i * 120;
          const rad = (deg * Math.PI) / 180;
          const left = Math.cos(rad) * R - BASE / 2;
          const top = Math.sin(rad) * R - BASE / 2;
          const labels = ["Red and orange", "Light blue", "Yellow and orange"] as const;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${labels[i]} theme`}
              aria-pressed={themeIndex === i}
              onClick={() => onThemeIndexChange(i)}
              className="absolute rounded-full border-2 border-black/25 shadow-md transition-[transform] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
              style={{
                width: BASE,
                height: BASE,
                left,
                top,
                backgroundColor: CIRCLE_COLORS[i],
                transform: `scale(${themeIndex === i ? 1.3 : 1})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
