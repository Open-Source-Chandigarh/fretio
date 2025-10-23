import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, Share2, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface LightboxControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
  imageUrl: string;
  productTitle?: string;
  canZoomIn: boolean;
  canZoomOut: boolean;
  currentZoom: number;
  className?: string;
}

const LightboxControls = ({
  onZoomIn,
  onZoomOut,
  onClose,
  imageUrl,
  productTitle,
  canZoomIn,
  canZoomOut,
  currentZoom,
  className,
}: LightboxControlsProps) => {
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productTitle || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Image downloaded",
        description: "The image has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle || 'Product Image',
          text: `Check out this image: ${productTitle || ''}`,
          url: imageUrl,
        });
        
        toast({
          title: "Shared successfully",
          description: "The image has been shared.",
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Could not share the image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {
        toast({
          title: "Fullscreen unavailable",
          description: "Your browser doesn't support fullscreen mode.",
          variant: "destructive",
        });
      });
    }
  };

  const controlButtonClass = cn(
    "h-10 w-10 rounded-full",
    "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
    "text-white border border-white/20",
    "transition-all duration-200",
    "hover:scale-110 active:scale-95",
    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Zoom In */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        disabled={!canZoomIn}
        className={controlButtonClass}
        aria-label="Zoom in"
        title="Zoom in (+)"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>

      {/* Zoom Out */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
        disabled={!canZoomOut}
        className={controlButtonClass}
        aria-label="Zoom out"
        title="Zoom out (-)"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>

      {/* Current Zoom Level */}
      <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
        {Math.round(currentZoom * 100)}%
      </div>

      {/* Download */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownload}
        className={controlButtonClass}
        aria-label="Download image"
        title="Download image"
      >
        <Download className="h-5 w-5" />
      </Button>

      {/* Share */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className={controlButtonClass}
        aria-label="Share image"
        title="Share image"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {/* Fullscreen */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFullscreen}
        className={controlButtonClass}
        aria-label="Toggle fullscreen"
        title="Fullscreen"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>

      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(controlButtonClass, "ml-2")}
        aria-label="Close lightbox"
        title="Close (ESC)"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default LightboxControls;

