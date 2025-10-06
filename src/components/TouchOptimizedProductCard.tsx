import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LazyImage from "./LazyImage";

interface TouchOptimizedProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair";
  images: string[];
  seller: {
    name: string;
    room: string;
    rating: number;
    id?: string;
  };
  category: string;
  timeAgo: string;
  views?: number;
  isForRent?: boolean;
  rentPricePerDay?: number;
  className?: string;
}

const TouchOptimizedProductCard = ({
  id,
  title,
  price,
  condition,
  images,
  seller,
  category,
  timeAgo,
  views = 0,
  isForRent = false,
  rentPricePerDay,
  className,
}: TouchOptimizedProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsFavorite(!isFavorite);
    
    // Add to favorites in database
    if (!isFavorite) {
      await supabase.from("favorites").insert({
        user_id: user.id,
        product_id: id,
      });
    } else {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out ${title} on Fretio`,
        url: window.location.origin + `/product/${id}`,
      });
    } else {
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.origin + `/product/${id}`);
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-card rounded-xl border border-border overflow-hidden",
        "hover:shadow-lg transition-shadow duration-300",
        "touch-manipulation", // Optimize for touch
        className
      )}
      style={{ opacity, scale }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Carousel with Swipe */}
      <motion.div
        className="relative aspect-square overflow-hidden cursor-pointer"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={() => navigate(`/product/${id}`)}
        style={{ x }}
      >
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <LazyImage
                src={image || "/placeholder.svg"}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            {isForRent && (
              <Badge className="bg-accent/90 text-accent-foreground">
                For Rent
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90">
              {category}
            </Badge>
          </div>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={cn(
              "p-2 rounded-full bg-background/90 backdrop-blur-sm",
              "active:scale-90 transition-all duration-200"
            )}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </motion.button>
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span className="text-xs">{views}</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Condition */}
        <div>
          <h3 className="font-semibold text-base line-clamp-2 mb-1">{title}</h3>
          <Badge
            variant="outline"
            className={cn(
              "text-xs capitalize",
              condition === "new" && "border-success text-success",
              condition === "like-new" && "border-primary text-primary",
              condition === "good" && "border-accent text-accent",
              condition === "fair" && "border-warning text-warning"
            )}
          >
            {condition.replace("-", " ")}
          </Badge>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">₹{price}</span>
          {isForRent && rentPricePerDay && (
            <span className="text-sm text-muted-foreground">
              or ₹{rentPricePerDay}/day
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">
                {seller.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-xs text-muted-foreground">Room {seller.room}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Action Buttons - Touch Optimized */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 h-10 active:scale-95 transition-transform"
            onClick={() => navigate(`/product/${id}`)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-10 px-3 active:scale-95 transition-transform"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TouchOptimizedProductCard;
