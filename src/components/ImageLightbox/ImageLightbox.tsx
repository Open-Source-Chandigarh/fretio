import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import ImageZoom from "./ImageZoom";
import ThumbnailStrip from "./ThumbnailStrip";
import LightboxControls from "./LightboxControls";
import NavigationArrows from "./NavigationArrows";

export interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  showThumbnails?: boolean;
  allowZoom?: boolean;
  maxZoom?: number;
  minZoom?: number;
}

const ImageLightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productTitle,
  showThumbnails = true,
  allowZoom = true,
  maxZoom = 5,
  minZoom = 1,
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Lock body scroll when lightbox is open
  useLockBodyScroll(isOpen);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen, initialIndex]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setZoom(1);
    } else {
      // Circular navigation: go to last image
      setCurrentIndex(images.length - 1);
      setZoom(1);
    }
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setZoom(1);
    } else {
      // Circular navigation: go to first image
      setCurrentIndex(0);
      setZoom(1);
    }
  }, [currentIndex, images.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoom(1);
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, maxZoom));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.5, minZoom));
  }, [minZoom]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.max(minZoom, Math.min(maxZoom, newZoom)));
  }, [minZoom, maxZoom]);

  // Keyboard navigation
  useKeyboardNavigation({
    isActive: isOpen,
    onPrevious: goToPrevious,
    onNext: goToNext,
    onClose,
    onZoomIn: allowZoom ? zoomIn : undefined,
    onZoomOut: allowZoom ? zoomOut : undefined,
  });

  // Swipe gesture for mobile
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
    isActive: isOpen && zoom === 1, // Only when not zoomed
  });

  // Pinch zoom for mobile
  const pinchHandlers = usePinchZoom({
    minZoom,
    maxZoom,
    onZoomChange: handleZoomChange,
    isActive: isOpen && allowZoom,
  });

  // Update pinch zoom current value
  useEffect(() => {
    pinchHandlers.updateCurrentZoom(zoom);
  }, [zoom, pinchHandlers]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;
    
    const preloadImages = [];
    
    // Preload next image
    if (currentIndex < images.length - 1) {
      const nextImg = new Image();
      nextImg.src = images[currentIndex + 1];
      preloadImages.push(nextImg);
    }
    
    // Preload previous image
    if (currentIndex > 0) {
      const prevImg = new Image();
      prevImg.src = images[currentIndex - 1];
      preloadImages.push(prevImg);
    }
  }, [currentIndex, images, isOpen]);

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0 || images.length > 1;
  const hasNext = currentIndex < images.length - 1 || images.length > 1;
  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-black/92 backdrop-blur-sm",
        "transition-opacity duration-300",
        isAnimating ? "opacity-0" : "opacity-100"
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      {...swipeHandlers}
      {...pinchHandlers}
    >
      {/* Close button (top right) */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-30",
          "h-12 w-12 rounded-full",
          "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
          "text-white border border-white/20",
          "transition-all duration-200",
          "hover:scale-110 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50",
          "flex items-center justify-center"
        )}
        aria-label="Close lightbox"
      >
        <span className="sr-only">Close (ESC)</span>
        ✕
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center px-4 py-20 md:px-20 md:py-24">
        <ImageZoom
          src={currentImage}
          alt={`${productTitle || 'Product'} - Image ${currentIndex + 1}`}
          zoom={zoom}
          onZoomChange={handleZoomChange}
          maxZoom={maxZoom}
          minZoom={minZoom}
        />
      </div>

      {/* Navigation arrows */}
      <NavigationArrows
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />

      {/* Controls (bottom center, above thumbnails) */}
      {allowZoom && (
        <div className={cn(
          "absolute z-20",
          showThumbnails && images.length > 1 
            ? "bottom-28" 
            : "bottom-8",
          "left-1/2 -translate-x-1/2"
        )}>
          <LightboxControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onClose={onClose}
            imageUrl={currentImage}
            productTitle={productTitle}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            currentZoom={zoom}
          />
        </div>
      )}

      {/* Thumbnail strip */}
      {showThumbnails && images.length > 1 && (
        <ThumbnailStrip
          images={images}
          currentIndex={currentIndex}
          onThumbnailClick={goToIndex}
        />
      )}

      {/* Focus trap elements */}
      <div
        tabIndex={0}
        onFocus={() => {
          // Focus trap: loop back to close button
          const closeButton = document.querySelector('[aria-label="Close lightbox"]') as HTMLButtonElement;
          closeButton?.focus();
        }}
      />
    </div>,
    document.body
  );
};

export default ImageLightbox;

