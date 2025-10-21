import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronDown,
  Trash2,
  Archive,
  Edit,
  Download,
  Upload,
  DollarSign,
  Tag,
  Package
} from "lucide-react";

interface BulkOperationsProps {
  selectedProducts: Set<string>;
  onClearSelection: () => void;
  onRefresh: () => void;
  allProducts: any[];
}

const BulkOperations = ({ selectedProducts, onClearSelection, onRefresh, allProducts }: BulkOperationsProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    status: "",
    condition: "",
    priceAdjustment: "",
    priceAdjustmentType: "percentage" as "percentage" | "fixed",
  });

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products? This action cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", Array.from(selectedProducts));

      if (error) throw error;

      toast({
        title: "Products deleted",
        description: `Successfully deleted ${selectedProducts.size} products`,
      });

      onClearSelection();
      onRefresh();
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkArchive = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: "draft" })
        .in("id", Array.from(selectedProducts));

      if (error) throw error;

      toast({
        title: "Products archived",
        description: `Successfully archived ${selectedProducts.size} products`,
      });

      onClearSelection();
      onRefresh();
    } catch (error) {
      console.error("Error archiving products:", error);
      toast({
        title: "Error",
        description: "Failed to archive products",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkEdit = async () => {
    setIsProcessing(true);
    try {
      const updates: any = {};

      if (bulkEditData.status) {
        updates.status = bulkEditData.status;
      }

      if (bulkEditData.condition) {
        updates.condition = bulkEditData.condition;
      }

      // Handle price adjustments
      if (bulkEditData.priceAdjustment) {
        const adjustment = parseFloat(bulkEditData.priceAdjustment);
        const selectedProductsData = allProducts.filter(p => selectedProducts.has(p.id));

        for (const product of selectedProductsData) {
          const updateData: any = { ...updates };

          if (product.sell_price) {
            if (bulkEditData.priceAdjustmentType === "percentage") {
              updateData.sell_price = product.sell_price * (1 + adjustment / 100);
            } else {
              updateData.sell_price = product.sell_price + adjustment;
            }
          }

          if (product.rent_price_per_day) {
            if (bulkEditData.priceAdjustmentType === "percentage") {
              updateData.rent_price_per_day = product.rent_price_per_day * (1 + adjustment / 100);
            } else {
              updateData.rent_price_per_day = product.rent_price_per_day + adjustment;
            }
          }

          const { error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", product.id);

          if (error) throw error;
        }
      } else if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("products")
          .update(updates)
          .in("id", Array.from(selectedProducts));

        if (error) throw error;
      }

      toast({
        title: "Products updated",
        description: `Successfully updated ${selectedProducts.size} products`,
      });

      setShowBulkEditDialog(false);
      setBulkEditData({
        status: "",
        condition: "",
        priceAdjustment: "",
        priceAdjustmentType: "percentage",
      });
      onClearSelection();
      onRefresh();
    } catch (error) {
      console.error("Error updating products:", error);
      toast({
        title: "Error",
        description: "Failed to update products",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = () => {
    const selectedProductsData = allProducts.filter(p => selectedProducts.has(p.id));
    
    const headers = [
      "ID",
      "Title",
      "Description",
      "Category",
      "Condition",
      "Listing Type",
      "Sell Price",
      "Rent Price (Day)",
      "Rent Price (Month)",
      "Status",
      "Views",
      "Created At",
    ];

    const rows = selectedProductsData.map(product => [
      product.id,
      product.title,
      product.description || "",
      product.categories?.name || "",
      product.condition,
      product.listing_type,
      product.sell_price || "",
      product.rent_price_per_day || "",
      product.rent_price_per_month || "",
      product.status,
      product.views_count || 0,
      new Date(product.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${selectedProducts.size} products to CSV`,
    });
  };

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
      
      const products = lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const product: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.replace(/"/g, "").trim();
          
          switch (header.toLowerCase()) {
            case "title":
              product.title = value;
              break;
            case "description":
              product.description = value;
              break;
            case "condition":
              product.condition = value;
              break;
            case "listing type":
              product.listing_type = value;
              break;
            case "sell price":
              product.sell_price = value ? parseFloat(value) : null;
              break;
            case "rent price (day)":
              product.rent_price_per_day = value ? parseFloat(value) : null;
              break;
            case "rent price (month)":
              product.rent_price_per_month = value ? parseFloat(value) : null;
              break;
            case "status":
              product.status = value || "available";
              break;
          }
        });
        
        return product;
      }).filter(p => p.title); // Filter out empty rows

      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Add seller_id to each product
      const productsWithSeller = products.map(p => ({
        ...p,
        seller_id: user.id,
        status: p.status || "available"
      }));

      const { error } = await supabase
        .from("products")
        .insert(productsWithSeller);

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Successfully imported ${products.length} products`,
      });

      setShowImportDialog(false);
      onRefresh();
    } catch (error) {
      console.error("Error importing CSV:", error);
      toast({
        title: "Import failed",
        description: "Failed to import products. Please check your CSV format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedProducts.size === allProducts.length && allProducts.length > 0}
            onCheckedChange={(checked) => {
              if (checked) {
                allProducts.forEach(p => selectedProducts.add(p.id));
              } else {
                selectedProducts.clear();
              }
              onRefresh();
            }}
          />
          <span className="text-sm text-muted-foreground">
            {selectedProducts.size} selected
          </span>
        </div>

        {selectedProducts.size > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowBulkEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleBulkDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              Clear Selection
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowImportDialog(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </div>

      {/* Bulk Edit Dialog */}
      <Dialog open={showBulkEditDialog} onOpenChange={setShowBulkEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Products</DialogTitle>
            <DialogDescription>
              Update multiple products at once. Leave fields empty to keep existing values.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select
                value={bulkEditData.status}
                onValueChange={(value) => setBulkEditData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Keep existing</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Condition</Label>
              <Select
                value={bulkEditData.condition}
                onValueChange={(value) => setBulkEditData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Keep existing</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price Adjustment</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={bulkEditData.priceAdjustment}
                  onChange={(e) => setBulkEditData(prev => ({ ...prev, priceAdjustment: e.target.value }))}
                />
                <Select
                  value={bulkEditData.priceAdjustmentType}
                  onValueChange={(value: "percentage" | "fixed") => 
                    setBulkEditData(prev => ({ ...prev, priceAdjustmentType: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">₹</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Positive values increase price, negative values decrease
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEdit} disabled={isProcessing}>
              {isProcessing ? "Updating..." : `Update ${selectedProducts.size} Products`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Products from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with product data. The file should include columns for:
              Title, Description, Category, Condition, Listing Type, Sell Price, Rent Price (Day), Status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-upload">Choose CSV File</Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                disabled={isProcessing}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-1">CSV Format Example:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                Title,Description,Condition,Listing Type,Sell Price,Rent Price (Day)<br />
                "iPhone 13","128GB Blue","like_new","sell",45000,<br />
                "Calculator","Scientific","good","both",500,50
              </code>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkOperations;
