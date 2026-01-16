"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; 
import type { BlogPost } from "@/lib/posts";

// MARKDOWN CONFIGURATION
const markdownComponents = {
  a: ({ href, children }: any) => (
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
  ul: ({ children }: any) => <ul className="list-disc ml-4 my-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
};

// HELPER: Shared Image Component
const PostImage = ({ src, alt }: { src?: string, alt?: string }) => (
  <div className="shrink-0 w-32 h-32 md:w-20 md:h-20 border-2 border-dashed border-[#e6dfa8] overflow-hidden rounded-xl relative transition-all duration-300">
    {src ? (
      <img 
        src={src} 
        alt={alt || "Post image"}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'; 
          (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#e5e7eb';
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
        Img
      </div>
    )}
  </div>
);

// HELPER: Reusable Card Content
const CardContent = ({ post }: { post: BlogPost; isOpen?: boolean }) => (
  <div className="group flex flex-col md:flex-row gap-4 cursor-pointer items-start">
    <PostImage src={post.image} alt={post.alt} />
    <div className="flex-1 flex justify-between items-start pt-1">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-doto font-bold underline underline-offset-4 leading-relaxed transition-colors">
          {post.summary}
        </p>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const BlogItem: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // SCENARIO A: Link
  if (post.type === 'link' && post.url) {
    return (
      // Added id={post.slug} to enable anchor linking (e.g. #my-link)
      <a 
        id={post.slug} 
        href={post.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block mb-12 scroll-mt-24 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
      >
        <CardContent post={post} />
      </a>
    );
  }

  // SCENARIO B: Text (Static)
  if (post.type === 'text') {
    return (
      // Added id={post.slug} to enable anchor linking
      <div id={post.slug} className="mb-12 scroll-mt-24">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <PostImage src={post.image} alt={post.alt} />
          
          <div className="flex-1 flex flex-col gap-2 pt-1">
            {post.summary && (
              <p className="text-sm leading-relaxed font-medium">
                {post.summary}
              </p>
            )}
            {post.body && (
              <div className="text-sm font-doto font-bold leading-relaxed whitespace-pre-wrap">
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
    // Added id={post.slug} to enable anchor linking
    <div id={post.slug} className="mb-12 scroll-mt-24">
      <div className="flex flex-col md:flex-row gap-4 items-start group">
        
        {/* Left Column: Image (Clickable) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 text-left focus:outline-none transition-opacity hover:opacity-80"
        >
          <PostImage src={post.image} alt={post.alt} />
        </button>

        {/* Right Column: Content */}
        <div className="flex-1 flex flex-col pt-1 w-full">
          {/* Header Row: Summary + Chevron */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full text-left flex justify-between items-start gap-2 focus:outline-none"
          >
            <span className="text-sm font-doto font-bold underline underline-offset-4 leading-relaxed transition-colors 
            transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]">
              {post.summary}
            </span>
          </button>

          {/* Body Row: Dropdown Content */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
            `}
          >
            <div className="text-sm font-doto font-bold leading-relaxed whitespace-pre-wrap">
              <ReactMarkdown components={markdownComponents}>{post.body || ''}</ReactMarkdown>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogItem;