import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Types based on Are.na API response
interface ArenaBlock {
  id: number;
  title: string;
  image: {
    display: { url: string };
    original: { url: string };
  } | null;
  class: string; // 'Image', 'Text', etc.
}

interface ArenaChannel {
  title: string;
  metadata: { description: string } | null; // Are.na sometimes nests description
}

interface ArenaCarouselProps {
  channelSlug: string; // e.g., 'visual-research-123'
}

const ArenaCarousel: React.FC<ArenaCarouselProps> = ({ channelSlug }) => {
  const [photos, setPhotos] = useState<ArenaBlock[]>([]);
  const [info, setInfo] = useState<{ title: string; description: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch channel details and contents (limit to 20 items for performance)
        const res = await fetch(`https://api.are.na/v2/channels/${channelSlug}?per=20`);
        const data = await res.json();

        // Filter for only blocks that have images
        const imageBlocks = data.contents.filter(
          (block: ArenaBlock) => block.image && block.class === 'Image'
        );

        setPhotos(imageBlocks);
        setInfo({
          title: data.title,
          // Handle potential missing description
          description: data.metadata?.description || "No description provided.", 
        });
      } catch (error) {
        console.error("Error fetching from Are.na:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelSlug]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  if (loading) return <div className="font-mono text-sm animate-pulse">loading arena channel...</div>;
  if (!info || photos.length === 0) return null;

  return (
    // Main Container: Dashed border, rounded, consistent with your site
    <div className="border-2 border-dashed border-yellow-600/50 rounded-2xl p-6 md:p-8 w-full max-w-4xl my-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column: Text Info */}
        <div className="flex-1 space-y-4 font-mono">
          <h2 className="text-xl text-yellow-500 font-bold lowercase">
            {info.title}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-gray-300 opacity-90">
            {info.description}
          </p>
          <div className="text-xs text-gray-500 pt-2">
            source: <a href={`https://are.na/channel/${channelSlug}`} target="_blank" rel="noreferrer" className="underline hover:text-yellow-500">are.na</a>
          </div>
        </div>

        {/* Right Column: Carousel */}
        <div className="flex-1 w-full flex flex-col items-center gap-3">
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-black/20 rounded-lg overflow-hidden border border-white/10">
            {photos[currentIndex]?.image && (
              <Image
                src={photos[currentIndex].image!.display.url}
                alt={photos[currentIndex].title || 'Arena Image'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Controls - styled to look "lo-fi" */}
          <div className="flex justify-between w-full font-mono text-sm text-yellow-500 select-none">
            <button 
              onClick={prevSlide} 
              className="hover:bg-yellow-500/10 px-2 py-1 rounded transition-colors"
            >
              [ &lt; prev ]
            </button>
            
            <span className="text-gray-500">
              {currentIndex + 1} / {photos.length}
            </span>

            <button 
              onClick={nextSlide} 
              className="hover:bg-yellow-500/10 px-2 py-1 rounded transition-colors"
            >
              [ next &gt; ]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArenaCarousel;