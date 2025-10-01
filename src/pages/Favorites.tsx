import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          product_id,
          products (
            id,
            title,
            description,
            sell_price,
            rent_price_per_day,
            rent_price_per_month,
            listing_type,
            condition,
            status,
            created_at,
            seller_id,
            category_id,
            product_images (
              image_url,
              is_primary
            ),
            categories (
              name,
              icon
            ),
            profiles!products_seller_id_fkey (
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      toast({
        title: "Error loading favorites",
        description: "Could not load your favorite items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
      
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error removing favorite",
        description: "Could not remove item from favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No favorites yet</CardTitle>
                <CardDescription>
                  Start browsing the marketplace and add items to your favorites to see them here.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const product = favorite.products;
                const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || 
                                   product.product_images?.[0]?.image_url;
                
                return (
                  <ProductCard
                    key={favorite.id}
                    id={product.id}
                    title={product.title}
                    price={product.sell_price || 0}
                    condition={product.condition}
                    images={primaryImage ? [primaryImage] : []}
                    seller={{
                      name: product.profiles?.full_name || 'Unknown',
                      room: 'N/A',
                      rating: 5,
                      id: product.seller_id
                    }}
                    category={product.categories?.name || 'Other'}
                    timeAgo={formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                    views={product.views_count || 0}
                    isForRent={product.listing_type === 'rent'}
                    rentPricePerDay={product.rent_price_per_day}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;