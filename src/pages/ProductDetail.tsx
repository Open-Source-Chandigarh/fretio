import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import UserRating from "@/components/UserRating";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  Flag,
  Calendar,
  Package,
  Shield,
  User,
  Phone,
  Mail,
  Home,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  description: string | null;
  sell_price: number | null;
  rent_price_per_day: number | null;
  rent_price_per_month: number | null;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  listing_type: "sell" | "rent" | "both";
  status: "draft" | "available" | "reserved" | "sold" | "rented" | null;
  views_count: number;
  created_at: string;
  is_featured: boolean | null;
  categories: { id: string; name: string; icon: string | null } | null;
  profiles: {
    user_id: string;
    full_name: string | null;
    room_number: string | null;
    phone_number: string | null;
    email: string;
    user_reviews_received: { rating: number }[];
  } | null;
  product_images: { image_url: string; is_primary: boolean; sort_order: number }[];
  hostels: { name: string; address: string | null } | null;
}

const conditionColors = {
  new: "bg-success/10 text-success border-success/20",
  like_new: "bg-primary/10 text-primary border-primary/20",
  good: "bg-accent/10 text-accent border-accent/20",
  fair: "bg-warning/10 text-warning border-warning/20",
  poor: "bg-destructive/10 text-destructive border-destructive/20",
};

const conditionLabels = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkIfFavorite();
      incrementViewCount();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (id, name, icon),
          profiles (
            user_id,
            full_name,
            room_number,
            phone_number,
            email,
            user_reviews_received:user_reviews!reviewee_id (rating)
          ),
          product_images (image_url, is_primary, sort_order),
          hostels (name, address)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setProduct(data as unknown as Product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user || !id) return;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .single();

    setIsFavorite(!!data);
  };

  const incrementViewCount = async () => {
    if (!user || !id) return;

    try {
      await supabase.rpc("upsert_viewed_product", {
        p_product_id: id,
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to favorite products.",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);

        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Product has been removed from your favorites.",
        });
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          product_id: id,
        });

        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Product has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessageSeller = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to message sellers.",
        variant: "destructive",
      });
      return;
    }

    if (!product?.profiles?.user_id) {
      toast({
        title: "Error",
        description: "Unable to identify seller.",
        variant: "destructive",
      });
      return;
    }

    if (product.profiles.user_id === user.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot start a chat with your own product.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .eq("product_id", id)
        .eq("buyer_id", user.id)
        .eq("seller_id", product.profiles.user_id)
        .single();

      if (existingChat) {
        navigate("/messages");
        return;
      }

      const { error } = await supabase.from("chats").insert({
        product_id: id,
        buyer_id: user.id,
        seller_id: product.profiles.user_id,
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

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || "Product",
          text: `Check out this product: ${product?.title}`,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our marketplace safe.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/marketplace")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const images = product.product_images
    .sort((a, b) =>
      a.is_primary ? -1 : b.is_primary ? 1 : a.sort_order - b.sort_order
    )
    .map((img) => img.image_url);

  const avgRating =
    product.profiles?.user_reviews_received?.length
      ? product.profiles.user_reviews_received.reduce(
          (sum, r) => sum + r.rating,
          0
        ) / product.profiles.user_reviews_received.length
      : 0;

  const timeAgo = new Date(product.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOwnProduct = user?.id === product.profiles?.user_id;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={() => navigate("/marketplace")}
            className="hover:text-foreground transition-colors"
          >
            Marketplace
          </button>
          <span>/</span>
          <span>{product.categories?.name || "Other"}</span>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur rounded-full px-3 py-1 text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Status Badge */}
              {product.status && product.status !== "available" && (
                <Badge className="absolute top-4 left-4 capitalize">
                  {product.status}
                </Badge>
              )}

              {/* Featured Badge */}
              {product.is_featured && (
                <Badge className="absolute top-4 right-4 bg-accent">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === idx
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  <div className="flex items-center flex-wrap gap-3">
                    <Badge variant="secondary" className="text-sm">
                      {product.categories?.icon} {product.categories?.name || "Other"}
                    </Badge>
                    <Badge
                      className={cn("text-sm border", conditionColors[product.condition])}
                    >
                      {conditionLabels[product.condition]}
                    </Badge>
                    {product.listing_type === "rent" && (
                      <Badge className="bg-accent text-accent-foreground">
                        For Rent
                      </Badge>
                    )}
                    {product.listing_type === "both" && (
                      <Badge className="bg-accent text-accent-foreground">
                        Sell or Rent
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className={cn(isFavorite && "text-destructive")}
                  >
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {!isOwnProduct && (
                    <Button variant="outline" size="icon" onClick={handleReport}>
                      <Flag className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                {(product.listing_type === "sell" || product.listing_type === "both") &&
                  product.sell_price && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Selling Price
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        ₹{product.sell_price.toLocaleString()}
                      </div>
                    </div>
                  )}

                {(product.listing_type === "rent" || product.listing_type === "both") && (
                  <div className="flex items-center space-x-4">
                    {product.rent_price_per_day && (
                      <div>
                        <div className="text-sm text-muted-foreground">Per Day</div>
                        <div className="text-2xl font-bold text-accent">
                          ₹{product.rent_price_per_day}
                        </div>
                      </div>
                    )}
                    {product.rent_price_per_month && (
                      <div>
                        <div className="text-sm text-muted-foreground">Per Month</div>
                        <div className="text-2xl font-bold text-accent">
                          ₹{product.rent_price_per_month}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{product.views_count || 0} views</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Listed {timeAgo}</span>
              </div>
              {product.hostels && (
                <div className="flex items-center space-x-2 text-sm col-span-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{product.hostels.name}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            {!isOwnProduct ? (
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleMessageSeller}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Message Seller
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Always meet in a safe public location
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    This is your product listing
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/my-products")}
                  >
                    Manage Your Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Seller Info */}
        {product.profiles && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {product.profiles.full_name?.[0]?.toUpperCase() || <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <div className="text-lg font-semibold">
                        {product.profiles.full_name || "Anonymous"}
                      </div>
                      {product.profiles.user_id && (
                        <UserRating userId={product.profiles.user_id} size="sm" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {product.profiles.room_number && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Room {product.profiles.room_number}</span>
                        </div>
                      )}
                      {product.profiles.phone_number && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{product.profiles.phone_number}</span>
                        </div>
                      )}
                      {product.profiles.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{product.profiles.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!isOwnProduct && (
                  <Button onClick={handleMessageSeller}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Similar Products could go here in the future */}
      </main>
    </div>
  );
};

export default ProductDetail;
