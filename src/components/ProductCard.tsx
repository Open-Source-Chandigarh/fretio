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
  "new": "bg-success/10 text-success border-success/20",
  "like-new": "bg-primary/10 text-primary border-primary/20", 
  "good": "bg-accent/10 text-accent border-accent/20",
  "fair": "bg-warning/10 text-warning border-warning/20",
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
  className 
}: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessageSeller = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to message sellers.",
        variant: "destructive"
      });
      return;
    }

    if (!seller.id) {
      toast({
        title: "Error",
        description: "Unable to identify seller.",
        variant: "destructive"
      });
      return;
    }

    if (seller.id === user.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot start a chat with your own product.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('product_id', id)
        .eq('buyer_id', user.id)
        .eq('seller_id', seller.id)
        .single();

      if (existingChat) {
        // Chat exists, navigate to messages
        navigate('/messages');
        return;
      }

      // Create new chat
      const { error } = await supabase
        .from('chats')
        .insert({
          product_id: id,
          buyer_id: user.id,
          seller_id: seller.id
        });

      if (error) throw error;

      toast({
        title: "Chat started",
        description: "You can now message the seller about this product.",
      });

      navigate('/messages');
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={cn(
      "group bg-card rounded-xl border shadow-fretio-sm hover:shadow-fretio-lg transition-all duration-200 overflow-hidden cursor-pointer",
      className
    )}>
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden" onClick={handleCardClick}>
        <img 
          src={images[0] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Rent Badge */}
        {isForRent && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            For Rent
          </Badge>
        )}

        {/* Views Counter */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-background/80 backdrop-blur rounded-full px-2 py-1 text-xs">
          <Eye className="h-3 w-3" />
          <span>{views}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3" onClick={handleCardClick}>
        {/* Category & Condition */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Badge className={cn("text-xs border", conditionColors[condition])}>
            {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-card-foreground line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-primary">₹{price}</span>
          {isForRent && rentPricePerDay && (
            <span className="text-sm text-muted-foreground">
              / ₹{rentPricePerDay} per day
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{seller.name}</div>
              <div className="text-xs text-muted-foreground">Room {seller.room}</div>
              {seller.id && (
                <UserRating userId={seller.id} size="sm" />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group/btn hover:bg-primary hover:text-primary-foreground"
          onClick={(e) => {
            e.stopPropagation();
            handleMessageSeller();
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
          Message Seller
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;