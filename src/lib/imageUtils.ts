interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  convertToWebP?: boolean;
}

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<{ file: File; webpFile?: File }> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    convertToWebP = true
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name,
              { type: file.type }
            );

            // Also create WebP version if supported
            if (convertToWebP && supportsWebP()) {
              canvas.toBlob(
                (webpBlob) => {
                  if (webpBlob) {
                    const webpFile = new File(
                      [webpBlob],
                      file.name.replace(/\.[^/.]+$/, '.webp'),
                      { type: 'image/webp' }
                    );
                    resolve({ file: compressedFile, webpFile });
                  } else {
                    resolve({ file: compressedFile });
                  }
                },
                'image/webp',
                quality
              );
            } else {
              resolve({ file: compressedFile });
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Calculate dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Check if browser supports WebP
 */
function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
}

/**
 * Generate responsive image sizes
 */
export function generateResponsiveSizes(
  originalWidth: number,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
): number[] {
  return breakpoints.filter(bp => bp < originalWidth).concat(originalWidth);
}

/**
 * Create srcset string for responsive images
 */
export function createSrcSet(
  baseUrl: string,
  sizes: number[],
  format: 'jpeg' | 'webp' = 'jpeg'
): string {
  return sizes
    .map(size => `${baseUrl}?w=${size}&fm=${format} ${size}w`)
    .join(', ');
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalFormat(): 'webp' | 'jpeg' {
  return supportsWebP() ? 'webp' : 'jpeg';
}

/**
 * Preload critical images
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Generate blur data URL for placeholder
 */
export async function generateBlurDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Create a small blurred version
        const size = 10;
        canvas.width = size;
        canvas.height = size;
        
        ctx.filter = 'blur(5px)';
        ctx.drawImage(img, 0, 0, size, size);
        
        resolve(canvas.toDataURL());
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
