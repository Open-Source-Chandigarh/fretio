import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import recommendationService from "@/services/recommendationService";
import { Users, Eye, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UsersAlsoViewedProps {
  productId: string;
  maxItems?: number;
}

interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  profiles: {
    user_id: string;
    full_name: string | null;
    room_number: string | null;
  } | null;
  categories: { name: string } | null;
  product_images: { image_url: string; is_primary: boolean }[];
  views_count: number;
  created_at: string;
}

const UsersAlsoViewed: React.FC<UsersAlsoViewedProps> = ({
  productId,
  maxItems = 6,
}) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchAlsoViewedProducts();
      trackCurrentView();
    }
  }, [productId, user]);

  const fetchAlsoViewedProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const alsoViewed = await recommendationService.getUsersAlsoViewed(
        productId,
        user.id,
        maxItems
      );
      setProducts(alsoViewed as Product[]);
    } catch (error) {
      console.error("Error fetching also viewed products:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackCurrentView = async () => {
    if (!user) return;
    
    try {
      await recommendationService.trackInteraction(
        user.id,
        productId,
        'view'
      );
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const formatProduct = (product: Product) => {
    const images = product.product_images
      .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : 0))
      .map((img) => img.image_url);

    return {
      id: product.id,
      title: product.title,
      price: product.sell_price || product.rent_price_per_day || 0,
      condition: product.condition.replace("_", "-") as any,
      images: images.length > 0 ? images : ["/placeholder.svg"],
      seller: {
        id: product.profiles?.user_id,
        name: product.profiles?.full_name || "Anonymous",
        room: product.profiles?.room_number || "N/A",
        rating: 0,
      },
      category: product.categories?.name || "Other",
      timeAgo: new Date(product.created_at).toLocaleDateString(),
      views: product.views_count || 0,
      isForRent: !!product.rent_price_per_day,
      rentPricePerDay: product.rent_price_per_day || undefined,
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Users Also Viewed
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-3">
              <Skeleton className="aspect-square mb-2 rounded" />
              <Skeleton className="h-3 mb-1" />
              <Skeleton className="h-4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length || !user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Users Also Viewed
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Eye className="h-3 w-3" />
            Based on browsing patterns of similar users
          </p>
        </div>
        {products.length > 6 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="group">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
              <div
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <img
                  src={
                    product.product_images.find((img) => img.is_primary)
                      ?.image_url || "/placeholder.svg"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.views_count > 100 && (
                  <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0">
                    Hot
                  </Badge>
                )}
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.sell_price || product.rent_price_per_day}
                  </span>
                  {product.rent_price_per_day && (
                    <Badge variant="outline" className="text-xs">
                      Rent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{product.views_count} views</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {products.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              // Navigate to a dedicated "more like this" page
              window.location.href = `/similar/${productId}`;
            }}
          >
            View More Similar Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersAlsoViewed;
