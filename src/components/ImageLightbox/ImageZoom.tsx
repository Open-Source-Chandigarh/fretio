import { useState, useRef, MouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  maxZoom: number;
  minZoom: number;
  className?: string;
}

const ImageZoom = ({
  src,
  alt,
  zoom,
  onZoomChange,
  maxZoom,
  minZoom,
  className,
}: ImageZoomProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const lastTapRef = useRef<number>(0);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Single click to toggle zoom
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    e.stopPropagation();
    
    if (zoom === 1) {
      // Zoom in to 2x
      onZoomChange(2);
    } else {
      // Zoom out to 1x
      onZoomChange(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Double tap to zoom on mobile
  const handleTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      e.stopPropagation();
      
      if (zoom === 1) {
        onZoomChange(2);
      } else {
        onZoomChange(1);
        setPan({ x: 0, y: 0 });
      }
    }
    
    lastTapRef.current = now;
  };

  // Mouse drag to pan when zoomed
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;
    
    e.preventDefault();
    
    const newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    
    // Limit pan to image bounds
    const maxPan = (zoom - 1) * 200;
    newPan.x = Math.max(-maxPan, Math.min(maxPan, newPan.x));
    newPan.y = Math.max(-maxPan, Math.min(maxPan, newPan.y));
    
    setPan(newPan);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag to pan when zoomed
  const touchStartPos = useRef({ x: 0, y: 0 });
  
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    
    touchStartPos.current = {
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y,
    };
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    const newPan = {
      x: e.touches[0].clientX - touchStartPos.current.x,
      y: e.touches[0].clientY - touchStartPos.current.y,
    };
    
    // Limit pan to image bounds
    const maxPan = (zoom - 1) * 200;
    newPan.x = Math.max(-maxPan, Math.min(maxPan, newPan.x));
    newPan.y = Math.max(-maxPan, Math.min(maxPan, newPan.y));
    
    setPan(newPan);
  };

  // Reset pan when zoom changes
  const handleZoomReset = () => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "w-full h-full select-none",
        zoom > 1 ? "cursor-move" : "cursor-zoom-in",
        className
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "max-w-full max-h-full object-contain transition-transform duration-200",
          isDragging && "transition-none"
        )}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
        draggable={false}
      />
    </div>
  );
};

export default ImageZoom;

