// "use client"
// import React, { useState, useEffect } from 'react';
// import { Search, Code, AlertCircle, ExternalLink, FileText, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';

// // Interfaces for Are.na Data
// interface ArenaImage {
//   display: { url: string };
//   original: { url: string };
// }

// interface ArenaSource {
//   url: string;
// }

// interface ArenaAttachment {
//   url: string;
//   extension: string;
// }

// interface ArenaBlock {
//   id: number;
//   class: 'Image' | 'Text' | 'Link' | 'Attachment' | 'Media';
//   title: string;
//   content_html?: string;
//   image?: ArenaImage;
//   source?: ArenaSource;
//   attachment?: ArenaAttachment;
//   created_at: string;
// }

// interface ChannelData {
//   title: string;
//   slug: string;
//   length: number;
//   user: { full_name: string };
//   contents: ArenaBlock[];
// }

// export default function App() {
//   const [slug, setSlug] = useState('together-twos');
//   const [channelData, setChannelData] = useState<ChannelData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showJson, setShowJson] = useState(false);
//   const [useProxy, setUseProxy] = useState(true);

//   // Function to fetch data from Are.na
//   const fetchChannel = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
    
//     setLoading(true);
//     setError(null);
//     setChannelData(null);

//     try {
//       // Clean up the slug input to handle full URLs
//       const cleanSlug = slug
//         .replace('https://www.are.na/channel/', '')
//         .replace('https://www.are.na/', '')
//         .split('/')
//         .pop();
        
//       const baseUrl = `https://api.are.na/v2/channels/${cleanSlug}`;
//       const params = '?per=20&page=1'; 
      
//       const url = useProxy 
//         ? `https://corsproxy.io/?${encodeURIComponent(baseUrl + params)}`
//         : baseUrl + params;

//       const response = await fetch(url);

//       if (!response.ok) {
//         if (response.status === 401) throw new Error("Unauthorized (401). Is this a private channel?");
//         if (response.status === 404) throw new Error("Channel not found (404). Check the slug.");
//         throw new Error(`API Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setChannelData(data);
//     } catch (err: unknown) {
//       console.error(err);
//       let msg = "An unknown error occurred.";
//       if (err instanceof Error) {
//         msg = err.message;
//         if (msg.includes('Failed to fetch')) {
//           msg = "Network Error (CORS). Try toggling the 'Use CORS Proxy' switch.";
//         }
//       }
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch on mount
//   useEffect(() => {
//     fetchChannel(); 
//   }, []);

//   return (
//     <div className="min-h-screen p-4 sm:p-6 font-sans ">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Header & Controls */}
//         <div className="space-y-6">
//           <div className="p-6 rounded-xl border border-dashed">
//             <form onSubmit={fetchChannel} className="flex flex-col md:flex-row gap-4 items-end">
//               <div className="flex-1 w-full">
//                 <label className="block text-xs font-bold uppercase tracking-wider  mb-2">
//                   Channel Slug or Link
//                 </label>
//                 <div className="relative group">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none group-focus-within:text-black transition-colors">/</span>
//                   <input
//                     type="text"
//                     value={slug}
//                     onChange={(e) => setSlug(e.target.value)}
//                     className="w-full pl-6 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all placeholder:text-neutral-300"
//                     placeholder="e.g. together-twos"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 pb-3">
//                 <label className="flex items-center gap-2 cursor-pointer select-none group">
//                   <input
//                     type="checkbox"
//                     checked={useProxy}
//                     onChange={(e) => setUseProxy(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
//                   />
//                   <span className="text-sm text-neutral-600 group-hover:text-black transition-colors">
//                     Use CORS Proxy
//                   </span>
//                 </label>
//               </div>

//               <div className="flex gap-2 w-full md:w-auto">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 md:flex-none bg-black px-6 py-2.5 rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors min-w-[120px] font-medium"
//                 >
//                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
//                   Fetch
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={() => setShowJson(!showJson)}
//                   className={`px-3 py-2.5 rounded-lg border transition-colors flex items-center justify-center ${
//                     showJson 
//                       ? 'bg-neutral-200 border-neutral-300 text-neutral-900' 
//                       : 'border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-300'
//                   }`}
//                   title="Toggle JSON View"
//                 >
//                   <Code className="w-4 h-4" />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
//             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
//             <div>
//               <h3 className="font-semibold">Error Fetching Data</h3>
//               <p className="text-sm opacity-90">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Results */}
//         {channelData && (
//           <div className="space-y-6 animate-in fade-in duration-500">
            
//             {/* Channel Info Header */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-neutral-100 pb-6 gap-4">
//               <div>
//                 <h2 className="text-3xl md:text-4xl font-bold font-rasterGrotesk tracking-tight ">{channelData.title}</h2>
//                 <div className="flex flex-wrap items-center gap-x-3 text-sm font-rasterGrotesk  mt-2 font-medium">
//                   <span className="text-bold">{channelData.user?.full_name}</span>
//                   <span className="w-1 h-1 font-rasterGrotesk text-semibold rounded-full" />
//                   <span>{channelData.length} blocks</span>
//                   <span className="w-1 h-1 font-rasterGrotesk text-semibold rounded-full" />
//                   <span className="uppercase tracking-widest text-xs font-rasterGrotesk">Updated Recently</span>
//                 </div>
//               </div>
//               <a 
//                 href={`https://www.are.na/channel/${channelData.slug}`} 
//                 target="_blank" 
//                 rel="noreferrer"
//                 className="flex items-center gap-2 text-sm underline font-medium font-rasterGrotesk hover:text-black transition-colors py-1 border-b border-transparent hover:border-black"
//               >
//                 Open on Are.na <ExternalLink className="w-3 h-3" />
//               </a>
//             </div>

//             {/* JSON Debug View */}
//             {showJson && (
//               <div className=" p-6 rounded-xl overflow-x-auto text-xs font-mono shadow-inner max-h-[500px] border">
//                 <pre>{JSON.stringify(channelData, null, 2)}</pre>
//               </div>
//             )}

//             {/* Grid View */}
//             {!showJson && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
//                 {channelData.contents?.map((block) => (
//                   <BlockCard key={block.id} block={block} />
//                 ))}
//               </div>
//             )}

//             {channelData.contents?.length === 0 && (
//               <div className="text-center py-20 rounded-xl border-2 border-dashed">
//                 <p className="text-neutral-400 font-medium">This channel is empty.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Sub-component to render individual blocks
// function BlockCard({ block }: { block: ArenaBlock }) {
//   const type = block.class;

//   return (
//     <div className="group relative flex flex-col rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-neutral-300 hover:-translate-y-1 transition-all duration-300 ease-out h-[400px]">
      
//       {/* Main Content Container */}
//       <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-neutral-50">
        
//         {/* IMAGE BLOCK */}
//         {type === 'Image' && block.image && (
//           <a 
//             href={block.image.original.url} 
//             target="_blank" 
//             rel="noreferrer" 
//             className="w-full h-full flex items-center justify-center p-4"
//           >
//             <img 
//               src={block.image.display.url} 
//               alt={block.title || 'Are.na Block'} 
//               className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
//               loading="lazy"
//             />
//           </a>
//         )}

//         {/* LINK BLOCK */}
//         {type === 'Link' && (
//           <a href={block.source?.url} target="_blank" rel="noreferrer" className="w-full h-full block relative">
//             {block.image ? (
//                <div className="w-full h-full relative">
//                  <img 
//                    src={block.image.display.url} 
//                    alt={block.title} 
//                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                  />
//                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
//                     <ExternalLink className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 w-8 h-8 drop-shadow-lg" />
//                  </div>
//                </div>
//             ) : (
//               <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors p-6 text-center">
//                 <LinkIcon className="w-12 h-12 text-blue-400 mb-4" />
//                 <span className="text-xs text-blue-600 font-mono break-all line-clamp-3 px-4">
//                   {block.source?.url}
//                 </span>
//               </div>
//             )}
//           </a>
//         )}

//         {/* TEXT BLOCK */}
//         {type === 'Text' && (
//           <div className="w-full h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-200 ">
//              <div 
//                className="prose prose-sm prose-neutral max-w-none font-serif leading-relaxed"
//                dangerouslySetInnerHTML={{ __html: block.content_html || '' }} 
//              />
//           </div>
//         )}

//         {/* ATTACHMENT / MEDIA */}
//         {(type === 'Attachment' || type === 'Media') && (
//           <a 
//             href={block.attachment?.url || block.source?.url} 
//             target="_blank" 
//             rel="noreferrer" 
//             className="w-full h-full flex flex-col items-center justify-center gap-6 p-6 text-center  transition-colors group/icon"
//           >
//              <div className="p-5 shadow-sm border rounded-2xl group-hover/icon:scale-110 transition-transform duration-300">
//                 {type === 'Media' ? <ImageIcon className="w-8 h-8 text-neutral-700" /> : <FileText className="w-8 h-8 " />}
//              </div>
//              <div className="space-y-2">
//                <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-neutral-200 text-neutral-600">
//                  {block.attachment?.extension || type}
//                </span>
//                <span className="block text-xs text-neutral-400">Click to open</span>
//              </div>
//           </a>
//         )}
//       </div>

//       {/* Footer Info */}
//       <div className="p-4 bg-red-300 border-t flex flex-col gap-2 shrink-0 h-[88px] justify-center">
//         <h3 
//           className="font-medium text-sm leading-snug line-clamp-2" 
//           title={block.title || 'Untitled'}
//         >
//           {block.title || <span className="italic font-normal">Untitled</span>}
//         </h3>
//         <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-medium">
//            <span>{type}</span>
//            <span>{new Date(block.created_at).toLocaleDateString()}</span>
//         </div>
//       </div>
//     </div>
//   );
// }