import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LazyImage from "./LazyImage";

interface SwipeableImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose?: () => void;
  showThumbnails?: boolean;
  className?: string;
}

const SwipeableImageGallery = ({
  images,
  initialIndex = 0,
  onClose,
  showThumbnails = true,
  className,
}: SwipeableImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setScale(1);
      setIsZoomed(false);
    } else {
      setScale(2);
      setIsZoomed(true);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className={cn("relative bg-black/95", className)}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="text-white">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleZoom}
              className="text-white hover:bg-white/20"
            >
              {isZoomed ? (
                <ZoomOut className="h-5 w-5" />
              ) : (
                <ZoomIn className="h-5 w-5" />
              )}
            </Button>
            
            {onClose && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag={isZoomed ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <motion.div
              animate={{ scale }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full"
            >
              <LazyImage
                src={images[currentIndex]}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="eager"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-4 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Touch Indicators - Mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions - Show on first view */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center gap-3">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Swipe to navigate</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </motion.div>
    </div>
  );
};

// Fullscreen Gallery Modal
export const ImageGalleryModal = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      <SwipeableImageGallery
        images={images}
        initialIndex={initialIndex}
        onClose={onClose}
        className="h-full"
      />
    </motion.div>
  );
};

export default SwipeableImageGallery;
