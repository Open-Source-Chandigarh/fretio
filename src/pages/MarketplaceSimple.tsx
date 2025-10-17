import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const MarketplaceSimple = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log('Fetching products...');
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('status', 'available');

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Marketplace</h1>
      <p className="mb-4">Found {products.length} products</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-semibold">{product.title}</h3>
            <p>Price: ₹{product.sell_price || product.rent_price_per_day || 'N/A'}</p>
            <p>Condition: {product.condition}</p>
            <p>Status: {product.status}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500">No products available</p>
      )}
    </div>
  );
};

export default MarketplaceSimple;
