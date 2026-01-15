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
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8">
      <ShootingStarCursor />
      
      {/* Main Layout Container 
        - Flex row on medium screens and up (md:flex-row)
        - Stacked column on mobile (flex-col)
        - Centered with max-width
      */}
      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 pointer-events-auto">
        
        {/* LEFT COLUMN: Bio & Carousel (60%) */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          
          {/* Bio Box */}
          <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 cursor-none text-left">
            <p className="text-sm font-bold font-doto mb-2">
              grace li is a technical artist at riot games working on teamfight tactics
            </p>
            <p className="text-sm font-bold font-doto mb-2">
              she has worked at columbia records as an art direction intern
            </p>
            <p className="text-sm font-bold font-doto mb-2">
              and microsoft as a software engineer
            </p>
            <p className="text-sm font-bold font-doto mb-2">
              she likes making things with code
            </p>
            <p className ="text-sm font-bold font-doto mt-4 text-amber-400/80">
              welcome to my internet room
            </p>
          </div>

          {/* Carousel Section */}
          <div className="flex flex-col items-center">
             <Carousel images={myImages} />
             <p className="text-sm font-doto mt-2 text-slate-400">
               my bedroom over the years 
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Links (40%) */}
        <div className="w-full md:w-[40%] flex flex-col h-full">
          <div className="h-full p-8 border-2 border-dashed border-slate-700 rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5">
            <h2 className="text-lg font-bold font-doto mb-4 text-amber-400">links</h2>
            {/* Placeholder for your links */}
            <ul className="space-y-2 font-doto text-sm">
              <li><a href="https://www.are.na/gli/index" className="hover:text-amber-300 underline">are.na</a></li>
              <li><a href="https://www.instagram.com/gracejli/" className="hover:text-amber-300 underline">some of my favorite photos</a></li>
              <li><a href="https://www.yourworldoftext.com/%7Egracejli/" className="hover:text-amber-300 underline">guestbook</a></li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}