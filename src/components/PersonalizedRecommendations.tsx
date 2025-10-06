import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import recommendationService from "@/services/recommendationService";
import { Sparkles, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PersonalizedRecommendationsProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showTrending?: boolean;
}

interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  seller_id: string;
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

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  title = "Recommended for You",
  subtitle = "Based on your interests and activity",
  maxItems = 8,
  showTrending = true,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personalized" | "trending">("personalized");

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Fetch personalized recommendations for logged-in users
        const personalizedRecs = await recommendationService.getPersonalizedRecommendations(
          user.id,
          maxItems
        );
        setRecommendations(personalizedRecs as Product[]);
      }
      
      if (showTrending || !user) {
        // Always fetch trending products
        const trending = await recommendationService.getTrendingProducts(maxItems);
        setTrendingProducts(trending as Product[]);
        
        // If user is not logged in, show trending as recommendations
        if (!user) {
          setRecommendations(trending as Product[]);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations();
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
        id: product.profiles?.user_id || product.seller_id,
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

  const displayProducts = activeTab === "personalized" ? recommendations : trendingProducts;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              {title}
            </h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="aspect-square mb-4 rounded-lg" />
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-6 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!displayProducts.length && !loading) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
        <p className="text-muted-foreground mb-4">
          {user
            ? "Start browsing products to get personalized recommendations"
            : "Sign in to get personalized recommendations"}
        </p>
        <Button
          onClick={() => navigate(user ? "/marketplace" : "/login")}
          variant="default"
        >
          {user ? "Browse Marketplace" : "Sign In"}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            {title}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {user && showTrending && (
            <div className="flex rounded-lg border p-1">
              <Button
                variant={activeTab === "personalized" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("personalized")}
                className="rounded-md"
              >
                For You
              </Button>
              <Button
                variant={activeTab === "trending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("trending")}
                className="rounded-md"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeTab === "trending" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated hourly based on community activity</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProducts.slice(0, maxItems).map((product, index) => (
          <div key={product.id} className="relative">
            {index === 0 && activeTab === "trending" && (
              <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                #1 Trending
              </Badge>
            )}
            <ProductCard {...formatProduct(product)} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/marketplace")}
          className="w-full sm:w-auto"
        >
          Explore All Products
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
