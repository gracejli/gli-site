export default function Loading() {
    return (
      <div className="flex flex-col gap-16">
        {[1,2,3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-[50ch] animate-pulse">
            <div className="w-24 h-24 bg-gray-200 flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-gray-200" />
              <div className="h-4 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  