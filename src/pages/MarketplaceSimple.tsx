import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  status: string;
  created_at: string;
  views_count?: number;
  categories: {
    name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

const MarketplaceSimple = () => {
  const [searchParams] = useSearchParams();
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
          categories (name)
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
    return <div className="p-8">Loading...</div>;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Category Filter */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditions.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <p className="mb-4 text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {selectedCondition !== 'All' && ` - ${selectedCondition} condition`}
        </p>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
              
              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ₹{product.sell_price || product.rent_price_per_day || 'N/A'}
                  {product.rent_price_per_day && <span className="text-sm text-gray-500">/day</span>}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="capitalize">{product.condition?.replace('_', ' ')}</span>
                  <span>{product.categories?.name || 'Uncategorized'}</span>
                </div>
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery) && (
              <button 
                className="mt-4 text-blue-500 hover:underline"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCondition('All');
                  setSortBy('Recent');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceSimple;
