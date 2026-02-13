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
          <div className="p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 cursor-none text-left">
            <p className="text-lg font-bianzhidai mb-2">
              grace li
            </p>
            <p className="text-sm font-bold font-fe mb-2">
              tinkerer in los angeles, from a small town in michigan.
            </p>
            <p className="text-sm font-bold font-fe mb-2">
              currently: i'm a technical artist at riot games working on making the game teamfight tactics as delightul as possible for players
            </p>
            <p className="text-sm font-bold font-fe mb-2">
              previously: at microsoft and at columbia records 
            </p>
            <p className ="text-sm font-bold font-febold mt-4 ">
              welcome to my internet room
            </p>
          </div>

          {/* Carousel Section */}
          <div className="flex flex-col items-center">
             <Carousel images={myImages} />
             <p className="text-sm font-fe mt-2">
               my bedroom over the years 
             </p>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Links (40%) */}
        <div className="w-full md:w-[40%] flex flex-col h-full">
          <div className="h-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5">
            <h2 className="text-lg font-bold font-bianzhidai mb-4">links</h2>
            {/* Placeholder for your links */}
            <ul className="space-y-2 font-fe text-sm font-bold">
              <li><a href="https://www.are.na/gli/index" className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)">are.na</a></li>
              <li><a href="https://www.instagram.com/gracejli/" className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)">some of my favorite photos</a></li>
              <li><a href="https://www.yourworldoftext.com/%7Egracejli/" className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)">guestbook</a></li>
              <li><a href="https://www.gracejli.com" className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)">my old, currently live project website</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}