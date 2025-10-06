import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import recommendationService from "@/services/recommendationService";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SimilarProductsProps {
  productId: string;
  currentProductCategory?: string;
  currentProductPrice?: number;
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

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  productId,
  currentProductCategory,
  currentProductPrice,
  maxItems = 6,
}) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    // Adjust items per view based on screen size
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  useEffect(() => {
    fetchSimilarProducts();
  }, [productId]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      const similarProducts = await recommendationService.getSimilarProducts(
        productId,
        maxItems
      );
      setProducts(similarProducts as Product[]);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoading(false);
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(products.length - itemsPerView, prev + itemsPerView)
    );
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerView < products.length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Similar Products
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  if (!products.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Similar Products
          </h2>
          <p className="text-sm text-muted-foreground">
            Based on category, price, and condition
          </p>
        </div>
        {products.length > itemsPerView && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}
            >
              <ProductCard {...formatProduct(product)} />
            </div>
          ))}
        </div>
      </div>

      {currentProductCategory && (
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            View all in {currentProductCategory}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
