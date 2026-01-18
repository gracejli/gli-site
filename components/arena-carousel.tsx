"use client";
import React, { useState, useEffect } from 'react';
import { Search, Code, AlertCircle, ExternalLink, FileText, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';

// todo: the photos populate the entire screen with thoughts and things 
// explodes onto the
export default function App() {
  const [slug, setSlug] = useState('together-twos');
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  // Function to fetch data from Are.na
  const fetchChannel = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError(null);
    setChannelData(null);

    try {
      const cleanSlug = slug.replace('https://www.are.na/channel/', '').replace('https://www.are.na/', '').split('/').pop();
      const baseUrl = `https://api.are.na/v2/channels/${cleanSlug}`;
      const params = '?per=20&page=1'; 
      
      const url = useProxy 
        ? `https://corsproxy.io/?${encodeURIComponent(baseUrl + params)}`
        : baseUrl + params;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized (401). Is this a private channel?");
        if (response.status === 404) throw new Error("Channel not found (404). Check the slug.");
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setChannelData(data);
    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (err.message.includes('Failed to fetch')) {
        msg = "Network Error (CORS). Try toggling the 'Use CORS Proxy' switch below.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchChannel(); 
  }, []);

  return (
    <div className="min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="space-y-6">

          <div className="p-6 rounded-xl shadow-sm border border-neutral-200">
            <form onSubmit={fetchChannel} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">
                  Channel Slug or Link
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full pl-6 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="e.g. together-twos"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="proxy"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <label htmlFor="proxy" className="text-sm cursor-pointer select-none">
                  Use CORS Proxy
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors min-w-[120px] justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Fetch
              </button>
            </form>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Error Fetching Data</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {channelData && (
          <div className="space-y-6">
            
            {/* Channel Info Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{channelData.title}</h2>
                <div className="flex flex-wrap items-center gap-x-2 text-sm mt-1">
                  <span>by {channelData.user?.full_name}</span>
                  <span>•</span>
                  <span>{channelData.length} blocks</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    channelData.status === 'public' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {channelData.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className={`flex-1 sm:flex-none justify-center px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    showJson ? 'bg-neutral-200' : 'border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  {showJson ? 'Hide JSON' : 'Show JSON'}
                </button>
                <a 
                  href={`https://www.are.na/channel/${channelData.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 sm:flex-none justify-center px-3 py-1.5 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open on Are.na
                </a>
              </div>
            </div>

            {/* JSON Debug View */}
            {showJson && (
              <div className="bg-neutral-900 text-neutral-300 p-4 rounded-lg overflow-x-auto text-xs font-mono shadow-inner max-h-96">
                <pre>{JSON.stringify(channelData, null, 2)}</pre>
              </div>
            )}

            {/* Grid View */}
            {!showJson && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {channelData.contents?.map((block) => (
                  <BlockCard key={block.id} block={block} />
                ))}
              </div>
            )}

            {channelData.contents?.length === 0 && (
              <div className="text-center py-12 rounded-lg border border-neutral-200 border-dashed">
                This channel has no contents or is restricted.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component to render individual blocks based on their class
function BlockCard({ block }) {
  const type = block.class; // "Image", "Text", "Link", "Attachment", "Media"

  return (
    <div className="group rounded-lg overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-300 flex flex-col aspect-square">
      
      {/* Block Content Area */}
      <div className="relative flex-1 flex p-4 items-center justify-center overflow-hidden">
        
        {/* IMAGE BLOCK */}
        {type === 'Image' && block.image && (
          <a href={block.image.original.url} target="_blank" rel="noreferrer" className="w-full h-full flex items-center justify-center ">
             <img 
              src={block.image.display.url} 
              alt={block.title || 'Are.na Block'} 
              className="w-full h-full object-contain  "
              loading="lazy"
            />
          </a>
        )}

        {/* LINK BLOCK */}
        {type === 'Link' && (
          <a href={block.source?.url} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col relative">
            {block.image ? (
               <div className="w-full h-full relative overflow-hidden">
                 <img 
                   src={block.image.display.url} 
                   alt={block.title} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
               </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <LinkIcon className="w-16 h-16 text-blue-300" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
               <ExternalLink className="w-5 h-5" />
            </div>
          </a>
        )}

        {/* TEXT BLOCK */}
        {type === 'Text' && (
          <div className="p-6 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200">
             <div 
               className="prose prose-neutral max-w-none font-serif leading-relaxed text-sm"
               dangerouslySetInnerHTML={{ __html: block.content_html }} 
             />
          </div>
        )}

        {/* ATTACHMENT / MEDIA / OTHER */}
        {(type === 'Attachment' || type === 'Media') && (
          <a href={block.attachment?.url || block.source?.url} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 text-center hover:bg-neutral-100 transition-colors">
             <div className="p-4 shadow-sm border border-neutral-200 rounded-2xl bg-white">
                {type === 'Media' ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
             </div>
             <div className="space-y-1">
               <span className="block text-xs font-bold uppercase tracking-widest truncate max-w-[150px]">{block.attachment?.extension || type}</span>
               <span className="block text-xs text-neutral-500">Click to open</span>
             </div>
          </a>
        )}
      </div>

      {/* Block Metadata Footer */}
      <div className="p-4  z-10 shrink-0">
        <h3 className="font-medium font-doto text-sm leading-snug text-wrap truncate" title={block.title || 'Untitled'}>
          {block.title || <span className="italic font-normal">Untitled</span>}
        </h3>
      </div>
    </div>
  );
}

/*
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-50">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full">
                {type === 'Link' && <LinkIcon className="w-3.5 h-3.5" />}
                {type === 'Image' && <ImageIcon className="w-3.5 h-3.5" />}
                {type === 'Text' && <FileText className="w-3.5 h-3.5" />}
                {type}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
                {new Date(block.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
        </div>
*/