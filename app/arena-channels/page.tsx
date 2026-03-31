"use client"; 
import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

/**
 * ARE.NA MULTI-CHANNEL VISUAL ARCHIVE
 * * Apple Photos aesthetic (square grid, minimal UI)
 * * Gemini AI integration for image insights
 */

const SLUGS = [
  '/you-and-one-other-thing',
    '/beach-objects-library',
    '/nights-outdoors-log',
  '/coffee-shop-passwords',
  'found-hearts',
  '/i-love-la-type',
  '/facebook-marketplace-objects',
  'decorative-english-l-xfghwrlxw',
  '/light-leaking-and-light-spilling',
  '/state-of-ai-generated-visual-content',
  '/google-map-reviews',
  '/i-am-a-perfect-t-shirt', 

  // Add your specific backend slugs here
];

type ArenaImage = {
  display?: { url?: string };
  original?: { url?: string };
};

type ArenaBlock = {
  id: number;
  title?: string;
  description?: string;
  description_html?: string;
  connected_at?: string;
  image?: ArenaImage;
};

/** Are.na v3 channel + contents shapes (only fields we use) */
type ArenaV3ChannelMeta = {
  id: number;
  title: string;
  slug?: string;
  description?: string | { plain?: string; html?: string; markdown?: string } | null;
};

type ArenaV3BlockRaw = {
  id: number;
  type?: string;
  title?: string;
  description?: string | { plain?: string; html?: string; markdown?: string } | null;
  image?: {
    src?: string;
    small?: { src?: string };
    medium?: { src?: string };
    large?: { src?: string };
  };
  connection?: { connected_at?: string };
};

type ArenaV3ContentsResponse = {
  data?: ArenaV3BlockRaw[];
};

type FormattedBlock = ArenaBlock & {
  image: ArenaImage;
  channelTitle: string;
};

type FormattedChannel = {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  length: number;
  thumbnail?: string;
  blocks: FormattedBlock[];
};

function channelDescriptionFromV3(channel: ArenaV3ChannelMeta): string | undefined {
  const d = channel.description;
  if (d == null) return undefined;
  if (typeof d === "string") return d;
  return d.plain ?? d.markdown;
}

function normalizeV3ImageBlock(raw: ArenaV3BlockRaw, channelTitle: string): FormattedBlock | null {
  const img = raw.image;
  if (!img?.src) return null;
  const displayUrl =
    img.small?.src ?? img.medium?.src ?? img.large?.src ?? img.src;
  const desc = raw.description;
  let description: string | undefined;
  let description_html: string | undefined;
  if (typeof desc === "string") {
    description = desc;
  } else if (desc && typeof desc === "object") {
    description = desc.plain ?? desc.markdown;
    description_html = desc.html;
  }
  return {
    id: raw.id,
    title: raw.title,
    description,
    description_html,
    connected_at: raw.connection?.connected_at,
    image: {
      display: { url: displayUrl },
      original: { url: img.src },
    },
    channelTitle,
  };
}

function formatConnectedAt(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arena-channels-about-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 font-sans text-sm text-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="arena-channels-about-title" className="font-semibold text-slate-900 mb-2">
          About
        </h2>
        <p className="leading-relaxed text-slate-600">
          each album here is one of my are.na channels, lovingly collected since 2019 when I started using are.na. 
          this format is the best way for me to share these channels and let people look through all the things i've been collecting, and noticing over the years.
          <br />
          open any album to view the channel description and link. all images have their timestamp and their title. welcome, and enjoy!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function AboutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 text-xs font-medium font-sans px-2.5 py-1.5 rounded-md bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700 transition-colors"
    >
      about
    </button>
  );
}

const App = () => {
  const [channels, setChannels] = useState<FormattedChannel[]>([]);
  const [currentView, setCurrentView] = useState('albums'); // 'albums' | 'grid'
  const [activeChannel, setActiveChannel] = useState<FormattedChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // Lightbox & AI State
  const [selectedBlock, setSelectedBlock] = useState<FormattedBlock | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const fetchAllChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = SLUGS.map(async slug => {
        const cleanSlug = slug.replace(/^\//, '');
        const enc = encodeURIComponent(cleanSlug);
        const [metaRes, contentsRes] = await Promise.all([
          fetch(`https://api.are.na/v3/channels/${enc}`),
          fetch(`https://api.are.na/v3/channels/${enc}/contents?per=50`),
        ]);
        if (!metaRes.ok) throw new Error(`Channel ${cleanSlug} not found`);
        if (!contentsRes.ok) throw new Error(`Channel ${cleanSlug} contents not found`);
        const channel = (await metaRes.json()) as ArenaV3ChannelMeta;
        const { data: rawBlocks = [] } = (await contentsRes.json()) as ArenaV3ContentsResponse;
        const imageBlocks = rawBlocks
          .map(b => normalizeV3ImageBlock(b, channel.title))
          .filter((b): b is FormattedBlock => b != null);
        // Sort by connected_at to simulate a chronological timeline like a camera roll
        const sortedBlocks = imageBlocks.sort(
          (a, b) =>
            new Date(b.connected_at ?? 0).getTime() - new Date(a.connected_at ?? 0).getTime(),
        );

        return {
          id: channel.id,
          title: channel.title,
          slug: channel.slug,
          description: channelDescriptionFromV3(channel),
          length: sortedBlocks.length,
          thumbnail: sortedBlocks[0]?.image.display?.url,
          blocks: sortedBlocks,
        };
      });

      const formattedChannels = await Promise.all(requests);

      setChannels(formattedChannels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllChannels();
  }, [fetchAllChannels]);

  // Handle closing the lightbox and resetting its state
  const closeLightbox = () => {
    setSelectedBlock(null);
    setShowInfo(false);
    setAiInsight('');
    setTouchStartX(null);
  };

  const selectedBlockIndex = selectedBlock && activeChannel
    ? activeChannel.blocks.findIndex((block) => block.id === selectedBlock.id)
    : -1;
  const hasPreviousBlock = selectedBlockIndex > 0;
  const hasNextBlock = activeChannel ? selectedBlockIndex < activeChannel.blocks.length - 1 : false;

  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    if (!activeChannel || selectedBlockIndex < 0) return;

    const nextIndex =
      direction === "prev" ? selectedBlockIndex - 1 : selectedBlockIndex + 1;

    if (nextIndex < 0 || nextIndex >= activeChannel.blocks.length) return;

    setSelectedBlock(activeChannel.blocks[nextIndex]);
    setShowInfo(false);
    setAiInsight('');
  }, [activeChannel, selectedBlockIndex]);

  useEffect(() => {
    if (!selectedBlock) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        navigateLightbox("prev");
      } else if (event.key === "ArrowRight") {
        navigateLightbox("next");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedBlock, navigateLightbox]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX == null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchEndX == null) {
      setTouchStartX(null);
      return;
    }

    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) >= swipeThreshold) {
      navigateLightbox(deltaX > 0 ? "prev" : "next");
    }

    setTouchStartX(null);
  };

  // Gemini API Call with Exponential Backoff
  const generateAIInsight = async () => {
    if (!selectedBlock) return;
    
    setIsGeneratingAI(true);
    setAiInsight('');
    
    const apiKey = ""; // API key is provided by the execution environment
    const prompt = `You are an elegant art curator. Write a very brief (1-2 sentences), poetic, and insightful "memory" note about an archived visual artifact titled "${selectedBlock.title || 'Untitled'}" found in a collection named "${selectedBlock.channelTitle}". ${selectedBlock.description ? `The original creator described it as: "${selectedBlock.description}".` : ''} Make it sound like an elegant Apple Photos memory caption. Do not use quotes around the output.`;

    const fetchWithBackoff = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "A quiet moment captured in the archive.";
        
      } catch (err) {
        if (retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithBackoff(retries - 1, delay * 2);
        }
        throw new Error("Could not generate insight at this time.");
      }
    };

    try {
      const insight = await fetchWithBackoff();
      setAiInsight(insight);
    } catch (err) {
      setAiInsight("An artifact preserved in time. (AI generation temporarily unavailable).");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-200 px-4 pt-12 pb-8">
      <nav className="text-md font-rasterGrotesk shrink-0 mb-8 w-full md:w-[60%] mx-auto">
        <Link href="/" className={linkClass}>
          home
        </Link>
        <span className="opacity-90"> :: </span>
        <Link href="/work" className={linkClass}>
          work
        </Link>
      </nav>
      
      {/* iOS Style Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 saturate-150">
        <div className="px-4 py-3 flex items-end justify-between w-full md:w-[60%] mx-auto min-h-[60px]">
          {currentView === 'albums' ? (
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">gli albums</h1>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <button 
                onClick={() => setCurrentView('albums')}
                className="flex items-center text-blue-500 hover:text-blue-600 mb-1 -ml-2 transition-colors"
              >
                <ChevronLeft size={24} />
                <span className="text-lg">Albums</span>
              </button>
              <div className="flex justify-between items-end">
                <div className="min-w-0 pr-4">
                  <h1 className="text-3xl font-bold tracking-tight text-black truncate">
                    {activeChannel?.title}
                  </h1>
                  {activeChannel?.description ? (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {activeChannel.description}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 mb-1 text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeChannel?.length} Photos
                  </p>
                  {activeChannel?.slug ? (
                    <a
                      href={`https://www.are.na/channel/${activeChannel.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
                    >
                      view channel
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full md:w-[60%] mx-auto min-h-[80vh]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="inline-block p-4 bg-red-50 text-red-600 rounded-lg">
              <p className="font-medium text-sm">{error}</p>
              <button onClick={fetchAllChannels} className="mt-2 text-xs underline">Retry</button>
            </div>
          </div>
        )}

        {/* Albums View */}
        {!loading && !error && currentView === 'albums' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {channels.map((channel) => (
              <div 
                key={channel.id} 
                className="group cursor-pointer flex flex-col"
                onClick={() => {
                  setActiveChannel(channel);
                  setCurrentView('grid');
                }}
              >
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative shadow-sm border border-gray-200/50 mb-3">
                  {channel.thumbnail ? (
                    <img 
                      src={channel.thumbnail} 
                      alt={channel.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Empty
                    </div>
                  )}
                </div>
                <h2 className="text-base font-medium text-black truncate pr-2">{channel.title}</h2>
                <p className="text-sm text-gray-500">{channel.length} Items</p>
              </div>
            ))}
          </div>
        )}

        {/* Flush Square Grid for Active Channel */}
        {!loading && !error && currentView === 'grid' && activeChannel && (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-[2px] bg-white p-[2px]">
            {activeChannel.blocks.map((block) => (
              <div 
                key={block.id} 
                className="aspect-square bg-gray-100 cursor-pointer overflow-hidden relative group"
                onClick={() => setSelectedBlock(block)}
              >
                <img 
                  src={block.image.display?.url ?? block.image.original?.url ?? ""} 
                  alt={block.title || 'Archive Image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 text-white px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs leading-tight truncate">
                    {block.title?.trim() || "Untitled"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* iOS Style Lightbox / Detail View */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          
          {/* Lightbox Header */}
          <header className="absolute top-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-white/90 to-transparent text-black">
            <button 
              onClick={closeLightbox}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="text-lg truncate max-w-[150px] md:max-w-xs">{activeChannel?.title || 'Back'}</span>
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-blue-600 text-white' : 'text-black hover:bg-black/10'}`}
            >
              <Info size={20} />
            </button>
          </header>
          
          {/* Main Image Area */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={() => navigateLightbox("prev")}
              disabled={!hasPreviousBlock}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white backdrop-blur-[1px] transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={24} />
            </button>
            <img 
              src={selectedBlock.image.original?.url ?? selectedBlock.image.display?.url ?? ""} 
              alt={selectedBlock.title}
              className="max-w-full max-h-full object-contain"
            />
            <button
              type="button"
              onClick={() => navigateLightbox("next")}
              disabled={!hasNextBlock}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white backdrop-blur-[1px] transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute right-4 bottom-4 max-w-[min(36rem,80vw)] bg-black/45 text-white rounded-lg px-4 py-3 backdrop-blur-[1px]">
              {formatConnectedAt(selectedBlock.connected_at) ? (
                <p className="text-[11px] md:text-xs text-white/80 mb-1">
                  {formatConnectedAt(selectedBlock.connected_at)}
                </p>
              ) : null}
              <h3 className="text-sm md:text-base font-semibold leading-snug">
                {selectedBlock.title?.trim() || "Untitled"}
              </h3>
              {selectedBlock.description ? (
                <div
                  className="mt-1.5 text-xs md:text-sm text-white/90 leading-relaxed max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: selectedBlock.description_html || selectedBlock.description,
                  }}
                />
              ) : null}
            </div>
          </div>

          {/* Bottom Info Sheet (Toggled) */}
          <div className={`bg-white border-t border-slate-200 text-slate-900 transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="p-6 max-w-3xl mx-auto space-y-6">
              
              <div>
                <h3 className="text-xl font-semibold mb-1">{selectedBlock.title || 'Untitled'}</h3>
                <p className="text-sm text-slate-500">From {selectedBlock.channelTitle}</p>
              </div>

              {/* Gemini AI Feature */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                  <Sparkles size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Curator's Insight</span>
                </div>
                
                {aiInsight ? (
                  <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-blue-400/50 pl-3">
                    "{aiInsight}"
                  </p>
                ) : (
                  <button 
                    onClick={generateAIInsight}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAI ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isGeneratingAI ? 'Analyzing artifact...' : 'Generate Insight'}
                  </button>
                )}
              </div>

              {selectedBlock.description && (
                <div className="text-sm text-slate-600 leading-relaxed max-h-32 overflow-y-auto pt-2 border-t border-slate-200"
                  dangerouslySetInnerHTML={{ __html: selectedBlock.description_html || selectedBlock.description }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    <AboutButton onClick={() => setAboutOpen(true)} />
    <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
};

export default App;