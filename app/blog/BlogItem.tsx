"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from "@/lib/posts";

const BlogItem: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Common styling for the image and text layout
  const CardContent = () => (
    <div className="group flex flex-row gap-4 cursor-pointer items-start">
      {/* Image Container */}
      <div className="shrink-0 w-12 h-12 overflow-hidden rounded-md bg-gray-100">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      
      {/* Content Side */}
      <div className="flex-1 flex justify-between items-start pt-1">
        <div className="flex flex-col gap-1">
          <p className="text-base text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
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
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          
          {/* Content Side */}
          <div className="flex-1 flex flex-col gap-2 pt-1">
            {post.summary && (
              <p className="text-base text-gray-800 font-medium">
                {post.summary}
              </p>
            )}
            {post.body && (
              <div className="text-gray-700 text-sm leading-relaxed">
                {post.body}
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
          ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
        `}
      >
        {post.body && (
              <div className="text-gray-700 text-sm leading-relaxed">
                {post.body}
              </div>
            )}
      </div>
    </div>
  );
};

export default BlogItem;
