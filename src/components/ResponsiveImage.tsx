import { useMemo } from "react";
import LazyImage from "./LazyImage";
import { generateResponsiveSizes, createSrcSet, getOptimalFormat } from "@/lib/imageUtils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  objectFit?: "cover" | "contain" | "fill";
}

const ResponsiveImage = ({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  aspectRatio = "auto",
  objectFit = "cover"
}: ResponsiveImageProps) => {
  const { srcSet, webpSrcSet, supportsWebP } = useMemo(() => {
    // For now, we'll use the Supabase transform API if available
    // Otherwise, we'll use the original image
    const isSupabaseUrl = src.includes('supabase');
    
    if (!isSupabaseUrl) {
      return {
        srcSet: src,
        webpSrcSet: null,
        supportsWebP: false
      };
    }

    // Generate responsive sizes
    const responsiveSizes = generateResponsiveSizes(1920);
    
    // Create srcsets for different formats
    const jpegSrcSet = createSrcSet(src, responsiveSizes, 'jpeg');
    const webpSrcSet = createSrcSet(src, responsiveSizes, 'webp');
    
    return {
      srcSet: jpegSrcSet,
      webpSrcSet: webpSrcSet,
      supportsWebP: getOptimalFormat() === 'webp'
    };
  }, [src]);

  const aspectRatioClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: ""
  };

  const containerClass = `${aspectRatioClasses[aspectRatio]} ${className || ''}`;

  // For WebP support, we use picture element
  if (webpSrcSet && supportsWebP) {
    return (
      <picture className={containerClass}>
        <source 
          type="image/webp" 
          srcSet={webpSrcSet}
          sizes={sizes}
        />
        <source 
          type="image/jpeg" 
          srcSet={srcSet}
          sizes={sizes}
        />
        <LazyImage
          src={src}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
          loading={priority ? "eager" : "lazy"}
        />
      </picture>
    );
  }

  // Fallback to regular LazyImage
  return (
    <LazyImage
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      className={containerClass}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

export default ResponsiveImage;
