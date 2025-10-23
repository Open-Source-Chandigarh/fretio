import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ThumbnailStripProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  className?: string;
}

const ThumbnailStrip = ({
  images,
  currentIndex,
  onThumbnailClick,
  className,
}: ThumbnailStripProps) => {
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const currentThumbnailRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to keep current thumbnail visible
  useEffect(() => {
    if (currentThumbnailRef.current && thumbnailsRef.current) {
      currentThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  if (images.length <= 1) return null;

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
        "max-w-full px-4",
        className
      )}
    >
      <div
        ref={thumbnailsRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-[90vw]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          
          return (
            <button
              key={index}
              ref={isActive ? currentThumbnailRef : null}
              onClick={(e) => {
                e.stopPropagation();
                onThumbnailClick(index);
              }}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden",
                "border-2 transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50",
                isActive
                  ? "border-primary scale-110 shadow-lg shadow-primary/50"
                  : "border-white/30 hover:border-white/60 opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={isActive}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Active indicator overlay */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThumbnailStrip;

