"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { skeletonToneClass } from "@/lib/skeleton-tone";

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
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [supportsHoverPreview, setSupportsHoverPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSupportsHoverPreview = () =>
      setSupportsHoverPreview(mediaQuery.matches);

    updateSupportsHoverPreview();
    mediaQuery.addEventListener("change", updateSupportsHoverPreview);

    return () =>
      mediaQuery.removeEventListener("change", updateSupportsHoverPreview);
  }, []);

  // Safely access link now that we have a default fallback
  const href = project?.link;
  const mediaSrc = project.hoverGif || project.img;
  const isGif = mediaSrc?.toLowerCase().endsWith(".gif") ?? false;
  const skeletonTone = skeletonToneClass(project.id);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Safe window dimension checks for SSR
  const winWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const winHeight = typeof window !== "undefined" ? window.innerHeight : 1000;

  // Pin the GIF corner nearest the viewport edge to the cursor; the image opens toward center.
  const leftOfCenter = mousePos.x < winWidth / 2;
  const aboveCenter = mousePos.y < winHeight / 2;
  const cornerTransform =
    leftOfCenter && aboveCenter
      ? "translate(0, 0)"
      : !leftOfCenter && aboveCenter
        ? "translate(-100%, 0)"
        : leftOfCenter && !aboveCenter
          ? "translate(0, -100%)"
          : "translate(-100%, -100%)";

  const content = (
    <div
      className="flex gap-4 mb-6 group/item cursor-pointer items-start"
      suppressHydrationWarning
    >
      
      {/* The Floating GIF/Image (Tracks the Title Hover & Stays within screen bounds) */}
      {supportsHoverPreview && isTitleHovering && mediaSrc && (
        <div
          className="fixed pointer-events-none z-50 w-60 h-60 rounded-xl shadow-2xl border border-[#e6dfa8]/30 overflow-hidden"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: cornerTransform,
          }}
        >
          <div className={`${skeletonTone} absolute inset-0`} aria-hidden />
          <Image
            src={mediaSrc}
            alt={`${project.title} preview`}
            fill
            sizes="240px"
            unoptimized={isGif}
            className={`object-cover transition-opacity duration-300 ${previewLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setPreviewLoaded(true)}
          />
        </div>
      )}

      {/* Side thumbnail: same asset as hover preview (GIF when hoverGif is set, else img) */}
      <div className="relative w-12 h-12 border-2 border-[#e6dfa8] flex-shrink-0 overflow-hidden rounded-xl">
        {mediaSrc && (
          <>
            <div className={`${skeletonTone} absolute inset-0`} aria-hidden />
            <Image
              src={mediaSrc}
              alt={project.title}
              fill
              sizes="48px"
              unoptimized={isGif}
              className={`object-cover transition-opacity duration-300 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setThumbLoaded(true)}
            />
          </>
        )}
      </div>
      
      <div>
        <h3 
          className="font-fe font-bold text-[var(--foreground)] underline underline-offset-4 leading-tight transition-all duration-200 group-hover/item:text-white group-hover/item:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] w-max"
          onMouseEnter={() => {
            if (supportsHoverPreview) setIsTitleHovering(true);
          }}
          onMouseLeave={() => setIsTitleHovering(false)}
          onMouseMove={supportsHoverPreview ? handleMouseMove : undefined}
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