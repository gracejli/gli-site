"use client"
import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import PROJECTS from '@/content/projects/projects.json'
// TODO: version 1 is the list, version 2 is the dynamic version

//- TYPES 
interface Project {
    id: string;
    title: string;
    category: string;
    year: string;
    image: string;
    description: string;
    body: string;
    link: string | null;
    linkText: string | null;
  }
interface ImageStageProps {
    activeImage: string | null;
    mousePos: { x: number; y: number };
  }
  
  interface ProjectRowProps {
    project: Project;
    isOpen: boolean;
    onToggle: () => void;
    onHover: (image: string | null) => void;
  }
  
// --- COMPONENTS ---

const Header = () => (
    <header className="mb-12 pt-8 font-doto">
      <h1 className="text-xl md:text-2xl font-normal tracking-tight">
        <a href="/" className="hover:underline">Grace Li</a>{' '}
      </h1>
    </header>
  );
  
  const ImageStage =({ activeImage, mousePos }: ImageStageProps) => {
    if (!activeImage) return null;
    
    return (
      <div 
        className="fixed z-50 pointer-events-none hidden lg:block w-64 h-48 md:w-96 md:h-72"
        style={{ 
          left: `${mousePos.x + 24}px`, 
          top: `${mousePos.y + 24}px` 
        }}
      >
        <img 
          src={activeImage} 
          alt="Preview" 
          className="w-full h-full object-cover rounded-sm shadow-lg border border-gray-100"
        />
      </div>
    );
  };
  
  const ProjectRow = ({ project, isOpen, onToggle, onHover }: ProjectRowProps)=> {
    return (
      <>
        {/* Main Row */}
        <tr 
          className="group cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={onToggle}
          onMouseEnter={() => onHover(project.image)}
          onMouseLeave={() => onHover(null)}
        >
          <td className="py-4 pr-4 align-top font-medium text-lg w-1/2 group-hover:pl-2 transition-all">
            {project.title}
          </td>
          <td className="py-4 px-2 align-top text-gray-600 w-1/4">
            {project.category}
          </td>
          <td className="py-4 pl-4 align-top text-right text-gray-500 w-1/4 font-mono text-sm">
            {project.year}
          </td>
        </tr>
  
        {/* Details Row (Accordion) */}
        {isOpen && (
          <tr className="bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <td colSpan={3} className="p-0">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Text Content */}
                  <div className="space-y-6">
                    <div className="text-lg font-medium leading-relaxed">
                      {project.description}
                    </div>
                    
                    <div className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {project.body}
                    </div>
  
                    {project.link && (
                      <div className="pt-2">
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-black border-b border-black hover:bg-black hover:text-white transition-colors px-1 py-0.5"
                        >
                          {project.linkText} <ExternalLink size={14} className="ml-2" />
                        </a>
                      </div>
                    )}
                  </div>
  
                  {/* Inline Image (Mobile/Tablet or Detail View) */}
                  <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-sm">
                     <img 
                       src={project.image} 
                       alt={project.title}
                       className="w-full h-full object-cover"
                     />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };
  
  export default function App() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
  
      window.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);
  
    const toggleProject = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    };
  
    return (
      <div className="min-h-screen bg-pink text-black font-sans selection:bg-yellow-200 selection:text-black">
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <Header />
          
          {/* Floating Preview Stage (Desktop only) */}
          <ImageStage activeImage={hoveredImage} mousePos={mousePos} />
  
          <div className="relative z-20 --background">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs uppercase tracking-widest text-gray-400">
                  <th className="py-2 font-normal w-1/2">Project</th>
                  <th className="py-2 px-2 font-normal w-1/4">Category</th>
                  <th className="py-2 text-right font-normal w-1/4">Year</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project) => (
                  <ProjectRow 
                    key={project.id}
                    project={project}
                    isOpen={expandedId === project.id}
                    onToggle={() => toggleProject(project.id)}
                    onHover={setHoveredImage}
                  />
                ))}
              </tbody>
            </table>
          </div>
  
          <footer className="mt-24 text-gray-400 text-sm text-center">
            <p>© {new Date().getFullYear()} Grace Li. All rights reserved.</p>
          </footer>
        </div>
      </div>
    );
  }