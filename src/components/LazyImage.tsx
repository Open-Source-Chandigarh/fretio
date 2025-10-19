import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  /**
   * Required, meaningful alternative text for the image.
   * If an empty string is passed, a fallback will be derived from the src and a dev error will be logged.
   */
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  srcSet?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

function deriveAltFromSrc(src: string): string {
  try {
    const path = src.split("?")[0].split("#")[0];
    const file = path.split("/").pop() || "image";
    const withoutExt = file.replace(/\.[a-zA-Z0-9]+$/, "");
    const spaced = withoutExt.replace(/[-_]+/g, " ").trim();
    return spaced || "Image";
  } catch {
    return "Image";
  }
}

function enforceAlt(alt: string, src: string): string {
  const trimmed = (alt ?? "").trim();
  if (trimmed.length > 0) return trimmed;
  const fallback = deriveAltFromSrc(src);
  if (import.meta.env.DEV) {
    console.error(
      `[a11y] Missing non-empty alt text for <LazyImage>. Using fallback derived from src: "${fallback}" (src: ${src})`
    );
  }
  return fallback;
}

const LazyImage = ({
  src,
  alt,
  className,
  placeholderSrc = "/placeholder.svg",
  onLoad,
  onError,
  srcSet,
  sizes,
  loading = "lazy"
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  const altText = enforceAlt(alt, src);

  useEffect(() => {
    // If loading is eager, load immediately
    if (loading === "eager") {
      setImageSrc(src);
      return;
    }

    // If IntersectionObserver is not supported, load immediately
    if (!window.IntersectionObserver) {
      setImageSrc(src);
      return;
    }

    // Set up intersection observer
    if (imageRef) {
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load the actual image
              setImageSrc(src);
              
              // Disconnect observer after loading
              if (intersectionObserverRef.current) {
                intersectionObserverRef.current.disconnect();
              }
            }
          });
        },
        {
          // Load images 50px before they enter viewport
          rootMargin: "50px",
          threshold: 0.01
        }
      );

      intersectionObserverRef.current.observe(imageRef);
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [imageRef, src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
    // Fallback to placeholder on error
    setImageSrc(placeholderSrc);
    if (onError) onError();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={altText}
        srcSet={srcSet}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError && "opacity-50"
        )}
        loading={loading}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
