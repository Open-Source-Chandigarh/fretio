import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  status: string;
  created_at: string;
  views_count?: number;
  seller_id: string;
  categories: {
    name: string;
  } | null;
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
}

interface Category {
  id: string;
  name: string;
}

const MarketplaceSimple = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get category from URL if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (data) {
        setCategories([{ id: 'all', name: 'All' }, ...data]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    console.log('Fetching products...');
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (image_url, is_primary, sort_order)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      console.log('Products response:', { data, error });

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/60 animate-pulse">
                <div className="aspect-square bg-muted rounded-t-2xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  const sortOptions = ['Recent', 'Price: Low to High', 'Price: High to Low', 'Most Viewed'];

  // Filter products based on category, condition and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      product.categories?.name === selectedCategory;
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = selectedCondition === 'All' ||
      (product.condition === 'like_new' && selectedCondition === 'Like New') ||
      product.condition?.toLowerCase().replace('_', ' ') === selectedCondition.toLowerCase();
    return matchesCategory && matchesSearch && matchesCondition;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High': {
        const priceA = a.sell_price || a.rent_price_per_day || 0;
        const priceB = b.sell_price || b.rent_price_per_day || 0;
        return priceA - priceB;
      }
      case 'Price: High to Low': {
        const priceA2 = a.sell_price || a.rent_price_per_day || 0;
        const priceB2 = b.sell_price || b.rent_price_per_day || 0;
        return priceB2 - priceA2;
      }
      case 'Most Viewed':
        return (b.views_count || 0) - (a.views_count || 0);
      default: // Recent
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Format product data for ProductCard component
  const formatProductForCard = (product: Product) => {
    const images = product.product_images && product.product_images.length > 0
      ? product.product_images
          .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : a.sort_order - b.sort_order))
          .map(img => img.image_url)
      : ["/placeholder.svg"];

    const timeAgo = () => {
      const created = new Date(product.created_at);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return "just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "1d ago";
      return `${diffDays}d ago`;
    };

    return {
      id: product.id,
      title: product.title,
      price: product.sell_price || product.rent_price_per_day || 0,
      condition: (product.condition?.replace('_', '-') || 'good') as "new" | "like-new" | "good" | "fair",
      images: images,
      seller: {
        id: product.seller_id,
        name: "Student Seller",
        room: "A-" + Math.floor(Math.random() * 300 + 1),
        rating: 4.5 + Math.random() * 0.5
      },
      category: product.categories?.name || "Other",
      timeAgo: timeAgo(),
      views: product.views_count || 0,
      isForRent: product.rent_price_per_day !== null,
      rentPricePerDay: product.rent_price_per_day || undefined
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section - Same style as Featured Products */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Filters Section - Clean style */}
        <div className="bg-slate-50 p-4 rounded-xl mb-6 border">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Category Filter */}
            <select
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditions.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(sort => (
                <option key={sort} value={sort}>{sort}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold">{sortedProducts.length}</span> of {products.length} products
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {selectedCondition !== 'All' && ` - ${selectedCondition} condition`}
          </p>
          {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCondition('All');
                setSortBy('Recent');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
        
        {/* Products Grid - Same as Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} {...formatProductForCard(product)} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters or search terms</p>
            {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCondition('All');
                  setSortBy('Recent');
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketplaceSimple;
