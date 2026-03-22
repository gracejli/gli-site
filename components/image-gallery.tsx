export interface PortfolioItem {
    id: string;
    url: string;
    alt: string;
    wrapperClass: string;
    imgClass: string;
  }
  
function ImageGallery({ items }: { items: PortfolioItem[] }) {
    return (
      <div className="w-full md:w-[55%] lg:w-[60%] md:flex-1 md:min-h-0 overflow-y-auto flex flex-col gap-4 md:pl-6 lg:pl-8">
        {items.map((item) => (
          <div key={item.id} className={item.wrapperClass}>
            <img
              src={item.url}
              alt={item.alt}
              className={item.imgClass}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

export default ImageGallery;