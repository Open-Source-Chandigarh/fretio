import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Eye, Clock, User, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserRating from "./UserRating";
import LazyImage from "./LazyImage";

interface ProductCardProps {
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

const conditionColors = {
  new: "bg-success/10 text-success border-success/20",
  "like-new": "bg-primary/10 text-primary border-primary/20",
  good: "bg-accent/10 text-accent border-accent/20",
  fair: "bg-warning/10 text-warning border-warning/20",
};

const ProductCard = ({
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
}: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleMessageSeller = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to message sellers.",
        variant: "destructive",
      });
      return;
    }

    if (!seller.id) {
      toast({
        title: "Error",
        description: "Unable to identify seller.",
        variant: "destructive",
      });
      return;
    }

    if (seller.id === user.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot start a chat with your own product.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .eq("product_id", id)
        .eq("buyer_id", user.id)
        .eq("seller_id", seller.id)
        .single();

      if (existingChat) {
        // Chat exists, navigate to messages
        navigate("/messages");
        return;
      }

      // Create new chat
      const { error } = await supabase.from("chats").insert({
        product_id: id,
        buyer_id: user.id,
        seller_id: seller.id,
      });

      if (error) throw error;

      toast({
        title: "Chat started",
        description: "You can now message the seller about this product.",
      });

      navigate("/messages");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} for ₹${price}`,
          url: url,
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing this product.",
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Product removed from your favorites." : "Product saved to your favorites.",
      className: isFavorited ? "" : "bg-success/10 border-success",
    });
  };
  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      role="article"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      aria-label={`Product: ${title}, Price: ₹${price}, Seller: ${seller.name}, Condition: ${condition}`}
      className={cn(
        "group bg-card rounded-2xl border border-border/60 shadow-fretio-sm hover:shadow-fretio-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer backdrop-blur-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isHovered && "border-primary/40 shadow-fretio-glow"
      )}
    >
      {/* Image with Carousel */}
      <div
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
        onClick={handleCardClick}
      >
        <LazyImage
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full rounded-t-2xl transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Glassmorphism Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        )} />

        {/* Image Navigation Dots */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  currentImageIndex === index 
                    ? "w-6 bg-white shadow-md" 
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(
              "h-10 w-10 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isFavorited 
                ? "bg-red-500 hover:bg-red-600 border-red-400" 
                : "bg-white/90 hover:bg-white border-slate-200"
            )}
            aria-label={isFavorited ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          >
            <Heart className={cn(
              "h-4 w-4 transition-all duration-300",
              isFavorited ? "fill-white text-white" : "text-red-500"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-10 w-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Share ${title}`}
          >
            <Share2 className="h-4 w-4 text-primary" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCardClick}
            className="h-10 w-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`View ${title} details`}
          >
            <ExternalLink className="h-4 w-4 text-accent" />
          </Button>
        </div>

        {/* Rent Badge */}
        {isForRent && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 shadow-lg animate-pulse">
            For Rent
          </Badge>
        )}

        {/* Views Counter */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md border border-white/50">
          <Eye className="h-3.5 w-3.5" />
          <span>{views}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3" onClick={handleCardClick}>
        {/* Category + Condition */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-xs bg-slate-100 border-slate-200 text-slate-600"
          >
            {category}
          </Badge>
          <Badge
            className={cn(
              "text-xs border rounded-full px-3 py-1 capitalize",
              conditionColors[condition]
            )}
          >
            {condition.replace("-", " ")}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-800 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-amber-600">₹{price}</span>
          {isForRent && rentPricePerDay && (
            <span className="text-sm text-slate-500">
              / ₹{rentPricePerDay} per day
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarFallback>
                <User className="h-4 w-4 text-slate-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-slate-800">
                {seller.name}
              </div>
              <div className="text-xs text-slate-500">Room {seller.room}</div>
              {seller.id && <UserRating userId={seller.id} size="sm" />}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Button */}
        <Button
          variant="outline"
          className="w-full mt-3 border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            handleMessageSeller();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
          aria-label={`Send message to ${seller.name} about ${title}`}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Seller
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
