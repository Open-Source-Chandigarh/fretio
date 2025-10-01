import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    condition: "good" as "new" | "like_new" | "good" | "fair",
    listing_type: "sell" as "sell" | "rent" | "both",
    sell_price: "",
    rent_price_per_day: "",
    rent_price_per_month: "",
    is_featured: false,
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (data) setCategories(data);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images per product.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId: string) => {
    const uploadPromises = selectedImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}_${index}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return {
        product_id: productId,
        image_url: publicUrl,
        is_primary: index === 0,
        sort_order: index
      };
    });

    const imageData = await Promise.all(uploadPromises);
    
    const { error } = await supabase
      .from('product_images')
      .insert(imageData);

    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.category_id || selectedImages.length === 0) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields and upload at least one image.",
          variant: "destructive",
        });
        return;
      }

      if (formData.listing_type === 'sell' && !formData.sell_price) {
        toast({
          title: "Missing price",
          description: "Please enter a sell price.",
          variant: "destructive",
        });
        return;
      }

      if (formData.listing_type === 'rent' && !formData.rent_price_per_day) {
        toast({
          title: "Missing price",
          description: "Please enter a rent price per day.",
          variant: "destructive",
        });
        return;
      }

      // Create product
      const productData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        condition: formData.condition,
        listing_type: formData.listing_type,
        sell_price: formData.sell_price ? parseFloat(formData.sell_price) : null,
        rent_price_per_day: formData.rent_price_per_day ? parseFloat(formData.rent_price_per_day) : null,
        rent_price_per_month: formData.rent_price_per_month ? parseFloat(formData.rent_price_per_month) : null,
        seller_id: user.id,
        status: 'available' as const,
        is_featured: formData.is_featured
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (productError) throw productError;

      // Upload images
      setUploadingImages(true);
      await uploadImages(product.id);

      toast({
        title: "Product created successfully!",
        description: "Your product has been listed in the marketplace.",
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">List New Product</h1>
              <p className="text-muted-foreground">Create a listing for your hostel community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 13 - 128GB Blue"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the condition, usage, and any other details..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, condition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Listing Type */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
                <CardDescription>Set your pricing and listing type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Listing Type</Label>
                  <RadioGroup
                    value={formData.listing_type}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, listing_type: value }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell" id="sell" />
                      <Label htmlFor="sell">Sell</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" />
                      <Label htmlFor="rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(formData.listing_type === 'sell' || formData.listing_type === 'both') && (
                  <div>
                    <Label htmlFor="sell_price">Sell Price (₹) *</Label>
                    <Input
                      id="sell_price"
                      type="number"
                      placeholder="0"
                      value={formData.sell_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, sell_price: e.target.value }))}
                    />
                  </div>
                )}

                {(formData.listing_type === 'rent' || formData.listing_type === 'both') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rent_price_per_day">Rent per Day (₹) *</Label>
                      <Input
                        id="rent_price_per_day"
                        type="number"
                        placeholder="0"
                        value={formData.rent_price_per_day}
                        onChange={(e) => setFormData(prev => ({ ...prev, rent_price_per_day: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rent_price_per_month">Rent per Month (₹)</Label>
                      <Input
                        id="rent_price_per_month"
                        type="number"
                        placeholder="0"
                        value={formData.rent_price_per_month}
                        onChange={(e) => setFormData(prev => ({ ...prev, rent_price_per_month: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Feature this product (highlights in search)</Label>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload up to 5 images (first image will be the main image)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Image Upload */}
                  {selectedImages.length < 5 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload images ({selectedImages.length}/5)
                        </span>
                      </Label>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                              Main
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingImages}
                className="min-w-32"
              >
                {loading ? "Creating..." : uploadingImages ? "Uploading..." : "Create Product"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;