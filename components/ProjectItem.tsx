"use client";

import React, { useState } from "react";

type Project = {
  id: number;
  title: string;
  desc: string;
  img?: string;
  hoverGif?: string; // New property for the side thumbnail hover effect
  link?: string; // full URL or path
  newTab?: boolean; // open link in a new tab
};

// Add a default project so the component doesn't crash if previewed in isolation without props
const defaultProject: Project = {
  id: 0,
  title: "Preview Project",
  desc: "Hover over the item to see the side thumbnail turn into a GIF.",
  img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop", // Static placeholder
  hoverGif: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", // Animated placeholder
  link: "#",
};

export default function ProjectItem({ project = defaultProject }: { project?: Project }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTitleHovering, setIsTitleHovering] = useState(false);

  // Safely access link now that we have a default fallback
  const href = project?.link;

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Safe window dimension checks for SSR
  const winWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const winHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

  // Smoothly shift the image's anchor point based on screen position to prevent cutoffs.
  // At the top of the screen, it renders below the cursor. At the bottom, it renders above.
  const xPercent = (mousePos.x / winWidth) * 100;
  const yPercent = (mousePos.y / winHeight) * 100;
  
  // Also add a 20px gap away from the cursor tip, flipping direction at the halfway point
  const xOffset = `calc(-${xPercent}% + ${mousePos.x > winWidth / 2 ? '-20px' : '20px'})`;
  const yOffset = `calc(-${yPercent}% + ${mousePos.y > winHeight / 2 ? '-20px' : '20px'})`;

  const content = (
    <div className="flex gap-4 mb-6 group cursor-pointer items-start">
      
      {/* The Floating GIF/Image (Tracks the Title Hover & Stays within screen bounds) */}
      {isTitleHovering && (project?.hoverGif || project?.img) && (
        <img
          src={project.hoverGif || project.img}
          alt={`${project.title} preview`}
          className="fixed pointer-events-none z-50 max-w-60 rounded-xl shadow-2xl border border-[#e6dfa8]/30"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: `translate(${xOffset}, ${yOffset})`,
          }}
        />
      )}

      {/* Your Side Thumbnail (Static) */}
      <div className="w-12 h-12 border-2 border-dashed border-[#e6dfa8] flex-shrink-0 overflow-hidden rounded-xl">
        {project?.img && (
          <img
            src={project.img}
            alt={project.title}
            width={48}
            height={48}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
      
      <div>
        <h3 
          className="font-fe font-bold underline underline-offset-4 leading-tight transition-all duration-200 group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] w-max"
          onMouseEnter={() => setIsTitleHovering(true)}
          onMouseLeave={() => setIsTitleHovering(false)}
          onMouseMove={handleMouseMove}
        >
          {project?.title}
        </h3>
        <p className="text-sm mt-0.5 font-fe font-bold opacity-80">{project?.desc}</p>
      </div>
    </div>
  );

  if (href) {
    const isExternal = project.newTab === true;
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return content;
}