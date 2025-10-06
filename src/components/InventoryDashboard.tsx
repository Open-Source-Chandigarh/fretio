import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingCart,
  AlertTriangle
} from "lucide-react";

interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  totalViews: number;
  statusBreakdown: {
    available: number;
    sold: number;
    rented: number;
    draft: number;
  };
  categoryBreakdown: Record<string, number>;
  conditionBreakdown: {
    new: number;
    like_new: number;
    good: number;
    fair: number;
  };
  listingTypeBreakdown: {
    sell: number;
    rent: number;
    both: number;
  };
}

interface InventoryDashboardProps {
  products: any[];
}

const InventoryDashboard = ({ products }: InventoryDashboardProps) => {
  // Calculate statistics
  const stats: InventoryStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.sell_price || 0), 0),
    totalViews: products.reduce((sum, p) => sum + (p.views_count || 0), 0),
    statusBreakdown: {
      available: products.filter(p => p.status === "available").length,
      sold: products.filter(p => p.status === "sold").length,
      rented: products.filter(p => p.status === "rented").length,
      draft: products.filter(p => p.status === "draft").length,
    },
    categoryBreakdown: products.reduce((acc, p) => {
      const category = p.categories?.name || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    conditionBreakdown: {
      new: products.filter(p => p.condition === "new").length,
      like_new: products.filter(p => p.condition === "like_new").length,
      good: products.filter(p => p.condition === "good").length,
      fair: products.filter(p => p.condition === "fair").length,
    },
    listingTypeBreakdown: {
      sell: products.filter(p => p.listing_type === "sell").length,
      rent: products.filter(p => p.listing_type === "rent").length,
      both: products.filter(p => p.listing_type === "both").length,
    }
  };

  const activeListings = stats.statusBreakdown.available;
  const activePercentage = stats.totalProducts > 0 
    ? (activeListings / stats.totalProducts) * 100 
    : 0;

  return (
    <div className="grid gap-6 mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{activeListings}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activePercentage.toFixed(1)}% of total
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Available</span>
                <Badge variant="default">{stats.statusBreakdown.available}</Badge>
              </div>
              <Progress 
                value={(stats.statusBreakdown.available / stats.totalProducts) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sold</span>
                <Badge variant="secondary">{stats.statusBreakdown.sold}</Badge>
              </div>
              <Progress 
                value={(stats.statusBreakdown.sold / stats.totalProducts) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Rented</span>
                <Badge variant="secondary">{stats.statusBreakdown.rented}</Badge>
              </div>
              <Progress 
                value={(stats.statusBreakdown.rented / stats.totalProducts) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Draft</span>
                <Badge variant="outline">{stats.statusBreakdown.draft}</Badge>
              </div>
              <Progress 
                value={(stats.statusBreakdown.draft / stats.totalProducts) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm truncate">{category}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              {Object.keys(stats.categoryBreakdown).length > 5 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{Object.keys(stats.categoryBreakdown).length - 5} more categories
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Condition Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">New</span>
              <Badge className="bg-success/10 text-success border-success/20">
                {stats.conditionBreakdown.new}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Like New</span>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {stats.conditionBreakdown.like_new}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Good</span>
              <Badge className="bg-accent/10 text-accent border-accent/20">
                {stats.conditionBreakdown.good}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Fair</span>
              <Badge className="bg-warning/10 text-warning border-warning/20">
                {stats.conditionBreakdown.fair}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {activeListings < 5 && stats.totalProducts > 0 && (
        <Card className="border-warning">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-semibold text-sm">Low Active Inventory</p>
                <p className="text-sm text-muted-foreground">
                  You only have {activeListings} active listings. Consider adding more products to maximize sales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryDashboard;
