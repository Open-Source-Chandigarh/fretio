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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      if (user) {
        const personalizedRecs = await recommendationService.getPersonalizedRecommendations(
          user.id,
          maxItems
        );
        setRecommendations(personalizedRecs as unknown as Product[]);
      }
      if (showTrending || !user) {
        const trending = await recommendationService.getTrendingProducts(maxItems);
        setTrendingProducts(trending as unknown as Product[]);
        if (!user) setRecommendations(trending as unknown as Product[]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchRecommendations();

  const formatProduct = (product: Product) => {
    const images = product.product_images
      .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : 0))
      .map((img) => img.image_url);

    const conditionMap: Record<string, "new" | "like-new" | "good" | "fair"> = {
      new: "new",
      "like-new": "like-new",
      good: "good",
      fair: "fair",
    };
    const rawCondition = product.condition.replace("_", "-").toLowerCase();
    const mappedCondition = conditionMap[rawCondition] ?? "good";

    return {
      id: product.id,
      title: product.title,
      price: product.sell_price || product.rent_price_per_day || 0,
      condition: mappedCondition as "new" | "like-new" | "good" | "fair",
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
            <h2 className="text-2xl font-bold flex items-center gap-2 animate-fade-in">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              {title}
            </h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse hover:scale-105 transition-transform">
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
        <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
        <p className="text-muted-foreground mb-4">
          {user
            ? "Start browsing products to get personalized recommendations"
            : "Sign in to get personalized recommendations"}
        </p>
        <Button
          onClick={() => navigate(user ? "/marketplace" : "/auth")}
          variant="default"
          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow hover:shadow-lg transition-all"
        >
          {user ? "Browse Marketplace" : "Sign In"}
        </Button>
      </Card>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Floating sparkles behind cards */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 bg-amber-300 rounded-full opacity-40 animate-float`}
            style={{
              top: `${Math.random() * 95}%`,
              left: `${Math.random() * 95}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-fade-in">
              {title}
            </h2>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
              {subtitle}
            </p>
          </div>

          {/* Tab & Refresh */}
          <div className="flex items-center gap-2">
            {user && showTrending && (
              <div className="flex rounded-full border bg-white shadow-md overflow-hidden">
                <Button
                  variant={activeTab === "personalized" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("personalized")}
                  className="rounded-l-full px-4"
                >
                  For You
                </Button>
                <Button
                  variant={activeTab === "trending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("trending")}
                  className="rounded-r-full px-4 flex items-center gap-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-9 w-9 hover:bg-amber-100 transition-transform active:rotate-45"
            >
              <RefreshCw className="h-4 w-4 text-amber-500" />
            </Button>
          </div>
        </div>

        {/* Trending Info */}
        {activeTab === "trending" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Updated hourly based on community activity</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.slice(0, maxItems).map((product, index) => (
            <div
              key={product.id}
              className="relative transform transition-all hover:scale-105 hover:shadow-xl rounded-2xl"
            >
              {index === 0 && activeTab === "trending" && (
                <Badge className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                  #1 Trending
                </Badge>
              )}
              <ProductCard {...formatProduct(product)} />
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate("/marketplace")}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Explore All Products
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float { animation: float infinite ease-in-out; }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}
      </style>
    </section>
  );
};

export default PersonalizedRecommendations;
