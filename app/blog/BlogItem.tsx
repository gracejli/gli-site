"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; 
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from "@/lib/posts";
import { ShootingStarCursor } from '@/components/shooting-star-cursor';

const BlogItem: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Common styling for the image and text layout
  const CardContent = () => (
    <div className="group flex flex-row gap-4 cursor-pointer items-start">
      {/* Image Container - Updated to w-12 to match your snippet */}
      <div className="shrink-0 w-12 h-12 overflow-hidden rounded-md bg-gray-100 relative">
        <img 
          src={post.image} 
          alt={post.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'; 
            (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#e5e7eb';
          }}
        />
      </div>
      
      {/* Content Side */}
      <div className="flex-1 flex justify-between items-start pt-1">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-700 leading-relaxed group-hover:text-blue-600 transition-colors">
            {post.summary}
          </p>
        </div>

        <div className="text-gray-400 ml-2 shrink-0 pt-1">
          {post.type === 'link' ? (
            <ArrowUpRight size={18} />
          ) : (
            isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />
          )}
        </div>
      </div>
    </div>
  );

   // --- MARKDOWN CONFIGURATION ---
  // This tells ReactMarkdown how to render specific HTML elements.
  // We use it to make links blue and underlined without needing external plugins.
  const markdownComponents = {
    // Styles links to be always underlined and blue
    a: ({ href, children }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 underline hover:text-blue-800 transition-colors"
        // Stop propagation so clicking a link doesn't toggle the dropdown (if inside one)
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </a>
    ),
    // Optional: Add basic styling for lists if you use them
    ul: ({ children }: any) => <ul className="list-disc ml-4 my-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
  };


  // SCENARIO A: The blog post is referring to a link to another page 
  if (post.type === 'link' && post.url) {
    return (
      <a href={post.url} className="block mb-12">
        <CardContent />
      </a>
    );
  }

  // SCENARIO B: It is a Text (just displays text, no interaction)
  if (post.type === 'text') {
    return (
      <div className="mb-12">
        <div className="flex flex-row gap-4 items-start">
          {/* Image Container */}
          <div className="shrink-0 w-12 h-12 overflow-hidden rounded-md bg-gray-100">
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'; 
                    (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#e5e7eb';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          
          {/* Content Side */}
          <div className="flex-1 flex flex-col gap-2 pt-1">
            {post.summary && (
              <p className="text-sm leading-relaxed">
                {post.summary}
              </p>
            )}
            {post.body && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO C: It is a Dropdown
  return (
    <div className="mb-12">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left"
      >
        <CardContent />
      </button>

      {/* The Dropdown Content */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
        `}
      >
        <div className="text-sm leading-relaxed ml-16 whitespace-pre-wrap">
          <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};


export default BlogItem;


