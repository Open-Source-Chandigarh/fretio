import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Eye, Trash2, MoreVertical, Calendar, TrendingUp } from "lucide-react";

interface MyProduct {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  listing_type: string;
  status: "draft" | "available" | "reserved" | "sold" | "rented";
  views_count: number;
  created_at: string;
  is_featured: boolean;
  categories: { name: string } | null;
  product_images: { image_url: string; is_primary: boolean }[];
}

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
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
          condition,
          listing_type,
          status,
          views_count,
          created_at,
          is_featured,
          categories (name),
          product_images (image_url, is_primary)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: "draft" | "available" | "reserved" | "sold" | "rented") => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: `Product status changed to ${newStatus}`,
      });

      fetchMyProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully",
      });

      fetchMyProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'secondary';
      case 'draft': return 'outline';
      case 'rented': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'sold': return 'text-muted-foreground';
      case 'draft': return 'text-warning';
      case 'rented': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatPrice = (product: MyProduct) => {
    if (product.listing_type === 'sell') {
      return `₹${product.sell_price}`;
    } else if (product.listing_type === 'rent') {
      return `₹${product.rent_price_per_day}/day`;
    } else {
      return `₹${product.sell_price} / ₹${product.rent_price_per_day}/day`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Products</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{products.length} total listings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{products.reduce((sum, p) => sum + (p.views_count || 0), 0)} total views</span>
              </div>
            </div>
          </div>

          <Button 
            variant="accent" 
            size="lg"
            onClick={() => navigate('/create-product')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Badge variant="secondary">
              {filteredProducts.length} results
            </Badge>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const mainImage = product.product_images.find(img => img.is_primary)?.image_url || 
                             product.product_images[0]?.image_url || 
                             "/placeholder.svg";

              return (
                <Card key={product.id} className="group hover:shadow-fretio-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img 
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Status Badge */}
                      <Badge 
                        variant={getStatusBadgeVariant(product.status)}
                        className={`absolute top-3 left-3 ${getStatusColor(product.status)}`}
                      >
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>

                      {/* Featured Badge */}
                      {product.is_featured && (
                        <Badge className="absolute top-3 right-3 bg-accent">
                          Featured
                        </Badge>
                      )}

                      {/* Actions Menu */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/product/${product.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/edit-product/${product.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {product.status === 'available' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'sold')}>
                                  Mark as Sold
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'rented')}>
                                  Mark as Rented
                                </DropdownMenuItem>
                              </>
                            )}
                            {product.status !== 'available' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'available')}>
                                Mark as Available
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Category & Views */}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {product.categories?.name || "Other"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{product.views_count || 0}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-card-foreground line-clamp-2 leading-tight">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(product)}
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-2 border-t">
                        <Calendar className="h-3 w-3" />
                        <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No products match your search criteria" : "You haven't listed any products yet"}
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/create-product')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Product
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProducts;