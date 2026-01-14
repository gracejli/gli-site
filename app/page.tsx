"use client"
import React from 'react';
import { ShootingStarCursor } from "@/components/shooting-star-cursor"
import Carousel from "@/components/Carousel"

export default function App() {
  const myImages = [
    '/images/2022-dorm-room.png',
    '/images/2025-los-feliz-room.png',
    '/images/2024-silverlake-room.png'
  ];

  return (
    // FIX 1: Move min-h-screen, flex, and padding to the <main> tag
    // FIX 2: Add 'overflow-hidden' to strictly prevent scrollbars/extra space
    // FIX 3: Added a background color (bg-slate-950) so your slate-400 text is visible
    <main className="relative w-full overflow-hidden flex flex-col items-center justify-center p-8">
      <ShootingStarCursor />
      {/* Content Wrapper */}
      <div className="z-10 text-center pointer-events-auto">
        
        {/* The Interactive Area */}
        {/* Removed 'mt-8' because flex-center on parent handles the positioning better */}
        <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 cursor-none">
          <p className="text-lg font-doto">
            grace li is a technical artist at riot games working on teamfight tactics
          </p>
          <p className="text-lg font-doto">
            she has worked at columbia records as an art direction intern
          </p>
          <p className="text-lg font-doto">
            and microsoft as a software engineer
          </p>
          <p className="text-lg font-doto">
            she likes making things with code
          </p>
          <p className ="text-lg font-doto">
            welcome to my internet room
          </p>
        </div>
        <Carousel images={myImages} />
        <p className="text-lg font-doto">
          my bedroom over the years 
        </p>
      </div>
    </main>
  );
}