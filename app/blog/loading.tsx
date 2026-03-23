import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-6">
          <div
            className="h-3 w-20 rounded bg-gray-200/50 dark:bg-gray-700/50 animate-pulse"
            aria-hidden
          />
        </div>
        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mb-12 scroll-mt-24 w-full animate-pulse"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                <div className="shrink-0 w-32 h-32 md:w-24 md:h-24 border-2 border-dashed border-[#e6dfa8] rounded-xl bg-gray-200/50 dark:bg-gray-700/50" />
                <div className="flex-1 flex flex-col gap-3 pt-1 w-full">
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-3/4" />
                  <div className="h-4 bg-gray-200/60 dark:bg-gray-700/60 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}