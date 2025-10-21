import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Eye, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
      aria-label={`Product: ${title}, Price: ₹${price}, Seller: ${seller.name}, Condition: ${condition}`}
      className={cn(
        "group bg-card rounded-2xl border border-border/60 shadow-fretio-sm hover:shadow-fretio-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden"
        onClick={handleCardClick}
      >
        <LazyImage
          src={images[0] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full rounded-t-2xl transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Floating Icons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/80 hover:bg-blue-100 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Add ${title} to favorites`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                // Add to favorites logic here
              }
            }}
          >
            <Heart className="h-4 w-4 text-amber-500" />
          </Button>
        </div>

        {/* Rent Badge */}
        {isForRent && (
          <Badge className="absolute top-3 left-3 bg-amber-100 text-amber-600 border border-amber-200 shadow-sm">
            For Rent
          </Badge>
        )}

        {/* Views */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-slate-600 shadow-sm">
          <Eye className="h-3 w-3" />
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
