import React from "react";

import { skeletonToneClass } from "@/lib/skeleton-tone";

export default function Loading() {
  return (
    <div className="min-h-screen background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-6">
          <div
            className="h-3 w-20 rounded bg-orange-300/50 dark:bg-gray-700/50 animate-pulse"
            aria-hidden
          />
        </div>
        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-12 scroll-mt-24 w-full">
              <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                <div className="relative shrink-0 w-32 h-32 md:w-24 md:h-24 overflow-hidden rounded-xl border-2">
                  <div
                    className={`${skeletonToneClass(i - 1)} absolute inset-0`}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 animate-pulse flex-col gap-3 pt-1 w-full">
                  <div className="h-4 w-3/4 rounded bg-orange-400/80 dark:bg-gray-700/80" />
                  <div className="h-4 w-1/2 rounded bg-orange-300/60 dark:bg-gray-700/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}