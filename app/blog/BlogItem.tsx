"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; 
import Image from "next/image";
import type { BlogPost } from "@/lib/posts";
import { skeletonToneClass } from "@/lib/skeleton-tone";

type AnchorProps = React.ComponentPropsWithoutRef<"a">;
type ListProps = React.ComponentPropsWithoutRef<"ul">;
type OrderedListProps = React.ComponentPropsWithoutRef<"ol">;
type ParagraphProps = React.ComponentPropsWithoutRef<"p">;

// MARKDOWN CONFIGURATION
const markdownComponents = {
  a: ({ href, children }: AnchorProps) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
      onClick={(e) => e.stopPropagation()} 
    >
      {children}
    </a>
  ),
  ul: ({ children }: ListProps) => <ul className="list-disc ml-4 my-2">{children}</ul>,
  ol: ({ children }: OrderedListProps) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
  p: ({ children }: ParagraphProps) => <p className="mb-2 last:mb-0 w-full">{children}</p>,
};

// HELPER: Shared Image Component
const PostImage = ({
  src,
  alt,
  toneIndex,
}: {
  src?: string;
  alt?: string;
  toneIndex: number;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="shrink-0 w-32 h-32 md:w-24 md:h-24 border-2 overflow-hidden rounded-xl relative transition-all duration-300">
      {src ? (
        <div className="relative w-full h-full">
          <div
            className={`${skeletonToneClass(toneIndex)} absolute inset-0`}
            aria-hidden
          />
          <Image 
            src={src} 
            alt={alt || "Post image"}
            fill
            sizes="96px"
            className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
          Img
        </div>
      )}
    </div>
  );
};

// HELPER: Reusable Card Content
const CardContent = ({
  post,
  toneIndex,
}: {
  post: BlogPost;
  isOpen?: boolean;
  toneIndex: number;
}) => (
  <div className="group flex flex-col md:flex-row gap-4 cursor-pointer items-start w-full">
    <PostImage src={post.image} alt={post.alt} toneIndex={toneIndex} />
    <div className="flex-1 flex justify-between items-start pt-1 w-full">
      <div className="flex flex-col gap-1 w-full">
        <p className="text-sm font-fe font-bold underline underline-offset-4 leading-relaxed transition-colors w-full">
          {post.summary}
        </p>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const BlogItem: React.FC<{ post: BlogPost; toneIndex: number }> = ({ post, toneIndex }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // SCENARIO A: Link (opens in same page)
  if (post.type === 'link' && post.url) {
    return (
      <a 
        id={post.slug} 
        href={post.url} 
        className="block mb-12 scroll-mt-24 w-full transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
      >
        <CardContent post={post} toneIndex={toneIndex} />
      </a>
    );
  }

  // SCENARIO B: Text (Static)
  if (post.type === 'text') {
    return (
      <div id={post.slug} className="mb-12 scroll-mt-24 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
          <PostImage src={post.image} alt={post.alt} toneIndex={toneIndex} />
          
          <div className="flex-1 flex flex-col gap-2 pt-1 w-full">
            {post.body && (
              <div className="text-sm font-fe font-bold leading-relaxed whitespace-pre-wrap w-full max-w-full break-words">
                <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO C: Dropdown
  return (
    <div id={post.slug} className="mb-12 scroll-mt-24 w-full">
      <div className="flex flex-col md:flex-row gap-4 items-start group w-full">
        
        {/* Left Column: Image (Clickable) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 text-left focus:outline-none transition-opacity hover:opacity-80"
        >
          <PostImage src={post.image} alt={post.alt} toneIndex={toneIndex} />
        </button>

        {/* Right Column: Content */}
        <div className="flex-1 flex flex-col pt-1 w-full">
          {/* Header Row: Summary + Chevron */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full text-left flex justify-between items-start gap-2 focus:outline-none"
          >
            <span className="text-sm font-fe font-bold underline underline-offset-4 leading-relaxed transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] w-full block">
              {post.summary}
            </span>
          </button>

          {/* Body Row: Dropdown Content */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out w-full
              ${isOpen ? 'opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
            `}
          >
            <div className="text-sm font-fe font-bold leading-relaxed whitespace-pre-wrap w-full max-w-full break-words">
              <ReactMarkdown components={markdownComponents}>{post.body || ''}</ReactMarkdown>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogItem;