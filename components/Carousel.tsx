import React, { useState, useEffect } from 'react';
import Image from "next/image";

// Define the shape of our props
interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // Change image every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    // Container: Square, Centered, Dashed Border matching your aesthetic
    <div className="relative mx-auto mt-10 w-80 h-80 overflow-hidden border-2 rounded-xl border-dashed border-[#4D5D99]">
      
      {/* Track: Holds the images and handles the sliding */}
      <div 
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        // We use inline style for the transform because the value is dynamic
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill
              sizes="(max-width: 768px) 16rem, 20rem"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Carousel;