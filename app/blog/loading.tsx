import React from 'react';

export default function Loading() {
  return (
    <div className="w-full">
      {[1, 2, 3].map((i) => (
        // Added max-w-2xl and reduced mb-12 to mb-8 to match BlogItem exactly
        <div key={i} className="mb-8 scroll-mt-24 w-full max-w-2xl animate-pulse">
          <div className="flex flex-col md:flex-row gap-4 items-start w-full">
            
            {/* Image Skeleton - Shrunk to w-20 h-20 to match updated PostImage */}
            <div className="shrink-0 w-20 h-20 md:w-20 md:h-20 border-2 border-dashed border-[#e6dfa8] rounded-xl bg-gray-200/50 dark:bg-gray-700/50" />
            
            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col gap-3 pt-1 w-full">
              {/* Simulating the summary string */}
              <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-3/4" />
              {/* Simulating the wrapped text or extra body content */}
              <div className="h-4 bg-gray-200/60 dark:bg-gray-700/60 rounded w-1/2" />
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}