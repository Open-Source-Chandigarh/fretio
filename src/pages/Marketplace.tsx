import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import AdvancedSearchFilters from "@/components/AdvancedSearchFilters";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import searchHistoryService from "@/services/searchHistoryService";
import { Search, Filter, Grid3X3, List, Plus, MapPin, Clock, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  rent_price_per_month: number | null;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  listing_type: "sell" | "rent" | "both";
  views_count: number;
  created_at: string;
  categories: { name: string } | null;
  profiles: {
    user_id: string;
    full_name: string | null;
    room_number: string | null;
    user_reviews_received: { rating: number }[];
  } | null;
  product_images: { image_url: string; is_primary: boolean; sort_order: number }[];
}

interface Category {
  id: string;
  name: string;
}

const conditions = ["All", "New", "Like New", "Good", "Fair"];
const sortOptions = ["Recent", "Price: Low to High", "Price: High to Low", "Most Viewed"];

const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [user]);

  useEffect(() => {
    // Track search query in history
    if (user && searchQuery.trim().length > 2) {
      const timer = setTimeout(() => {
        searchHistoryService.addSearchQuery({
          user_id: user.id,
          query: searchQuery,
          filters: {
            category: selectedCategory,
            condition: selectedCondition,
            sortBy: sortBy,
            advancedFilters: advancedFilters
          },
          results_count: filteredProducts.length
        });
      }, 1000); // Debounce for 1 second
      return () => clearTimeout(timer);
    }
  }, [searchQuery, user, filteredProducts.length]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (data) setCategories([{ id: 'all', name: 'All' }, ...data]);
  };

  const fetchProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select(`
          id,
          title,
          sell_price,
          rent_price_per_day,
          rent_price_per_month,
          condition,
          listing_type,
          views_count,
          created_at,
          categories (name),
          profiles (
            user_id,
            full_name,
            room_number,
            user_reviews_received:user_reviews!reviewee_id (rating)
          ),
          product_images (image_url, is_primary, sort_order)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (data) setProducts(data as unknown as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
      (product.categories?.name && selectedCategory === product.categories.name);
    const matchesCondition = selectedCondition === "All" || 
      (product.condition === "like_new" && selectedCondition === "Like New") ||
      product.condition.toLowerCase().replace('_', ' ') === selectedCondition.toLowerCase();
    
    // Apply advanced filters if set
    if (advancedFilters) {
      const price = product.sell_price || product.rent_price_per_day || 0;
      const matchesPriceRange = price >= advancedFilters.priceRange[0] && price <= advancedFilters.priceRange[1];
      const matchesAdvancedConditions = advancedFilters.conditions.length === 0 || 
        advancedFilters.conditions.includes(product.condition);
      const matchesAdvancedCategories = advancedFilters.categories.length === 0 || 
        (product.categories && advancedFilters.categories.includes(product.categories.id));
      const matchesListingTypes = advancedFilters.listingTypes.length === 0 || 
        advancedFilters.listingTypes.includes(product.listing_type);
      
      return matchesSearch && matchesCategory && matchesCondition && 
        matchesPriceRange && matchesAdvancedConditions && matchesAdvancedCategories && matchesListingTypes;
    }
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleAdvancedFiltersChange = (filters: any) => {
    setAdvancedFilters(filters);
    // Update sort if advanced filters include sort
    if (filters.sortBy) {
      const sortMapping: any = {
        'recent': 'Recent',
        'price_low': 'Price: Low to High',
        'price_high': 'Price: High to Low',
        'views': 'Most Viewed',
        'distance': 'Recent' // We'll handle distance sorting later
      };
      setSortBy(sortMapping[filters.sortBy] || 'Recent');
    }
  };

  const handleSearchHistorySelect = (query: string) => {
    setSearchQuery(query);
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const currentSort = advancedFilters?.sortBy ? 
      { 'recent': 'Recent', 'price_low': 'Price: Low to High', 'price_high': 'Price: High to Low', 'views': 'Most Viewed' }[advancedFilters.sortBy] || sortBy 
      : sortBy;
      
    switch (currentSort) {
      case "Price: Low to High":
        const priceA = a.sell_price || a.rent_price_per_day || 0;
        const priceB = b.sell_price || b.rent_price_per_day || 0;
        return priceA - priceB;
      case "Price: High to Low":
        const priceA2 = a.sell_price || a.rent_price_per_day || 0;
        const priceB2 = b.sell_price || b.rent_price_per_day || 0;
        return priceB2 - priceA2;
      case "Most Viewed":
        return (b.views_count || 0) - (a.views_count || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const formatProduct = (product: Product) => {
    const images = product.product_images
      .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : a.sort_order - b.sort_order))
      .map(img => img.image_url);

    const avgRating = product.profiles?.user_reviews_received?.length 
      ? product.profiles.user_reviews_received.reduce((sum, r) => sum + r.rating, 0) / product.profiles.user_reviews_received.length
      : 0;

    const timeAgo = new Date(product.created_at).toLocaleDateString();

    return {
      id: product.id,
      title: product.title,
      price: product.sell_price || product.rent_price_per_day || 0,
      condition: product.condition.replace('_', '-') as "new" | "like-new" | "good" | "fair",
      images: images.length > 0 ? images : ["/placeholder.svg"],
      seller: {
        id: product.profiles?.user_id,
        name: product.profiles?.full_name || "Anonymous",
        room: product.profiles?.room_number || "N/A",
        rating: avgRating
      },
      category: product.categories?.name || "Other",
      timeAgo,
      views: product.views_count || 0,
      isForRent: product.listing_type === "rent" || product.listing_type === "both",
      rentPricePerDay: product.rent_price_per_day || undefined
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Marketplace</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Hostel A Community</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{products.length} active listings</span>
              </div>
            </div>
          </div>

          <Button 
            variant="accent" 
            size="lg" 
            className="shrink-0"
            onClick={() => navigate('/create-product')}
          >
            <Plus className="h-4 w-4 mr-2" />
            List New Item
          </Button>
        </div>

        {/* Filters Section */}
        <section 
          className="bg-card border rounded-xl p-4 mb-6 space-y-4" 
          role="search" 
          aria-label="Product search and filters"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search products"
                type="search"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition Filter */}
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-full md:w-[150px]" aria-label="Filter by condition">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(cond => (
                  <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Sort products">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(sort => (
                  <SelectItem key={sort} value={sort}>{sort}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters */}
            <AdvancedSearchFilters
              onFiltersChange={handleAdvancedFiltersChange}
              onSearchHistorySelect={handleSearchHistorySelect}
              categories={categories.filter(c => c.id !== 'all')}
              initialFilters={advancedFilters}
            />
          </div>

          {/* View Toggle & Active Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {sortedProducts.length} results
              </Badge>
              {(selectedCategory !== "All" || selectedCondition !== "All" || searchQuery) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedCondition("All");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <div className="flex rounded-lg border" role="tablist" aria-label="View mode">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  role="tab"
                >
                  <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  role="tab"
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section aria-label="Product listings">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...formatProduct(product)}
                className={viewMode === "list" ? "flex-row max-w-none" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCondition("All");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
        </section>

        {/* Load More */}
        {sortedProducts.length > 0 && !loading && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;