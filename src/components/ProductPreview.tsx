import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Edit, CheckCircle } from 'lucide-react';

interface ProductPreviewProps {
  formData: {
    title: string;
    description: string;
    category_id: string;
    condition: 'new' | 'like_new' | 'good' | 'fair';
    listing_type: 'sell' | 'rent' | 'both';
    sell_price: string;
    rent_price_per_day: string;
    rent_price_per_month: string;
    is_featured: boolean;
  };
  categories: Array<{ id: string; name: string }>;
  imagePreview: string[];
  onEdit: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

const ProductPreview = ({ 
  formData, 
  categories, 
  imagePreview, 
  onEdit, 
  onPublish, 
  isPublishing 
}: ProductPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const category = categories.find(cat => cat.id === formData.category_id);
  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPriceDisplay = () => {
    if (formData.listing_type === 'sell') {
      return `₹${formData.sell_price}`;
    } else if (formData.listing_type === 'rent') {
      return `₹${formData.rent_price_per_day}/day`;
    } else {
      return `₹${formData.sell_price} (buy) or ₹${formData.rent_price_per_day}/day (rent)`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <Eye className="h-4 w-4 mr-2" />
          Preview Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Preview</DialogTitle>
          <DialogDescription>
            This is how your product will appear to other users in the marketplace
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Images Section */}
          <div className="space-y-4">
            {imagePreview.length > 0 ? (
              <>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview[0]}
                    alt="Main product image"
                    className="w-full h-full object-cover"
                  />
                </div>
                {imagePreview.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imagePreview.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                          src={image}
                          alt={`Product image ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No images uploaded</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              {formData.is_featured && (
                <Badge className="mb-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                  Featured
                </Badge>
              )}
              <h2 className="text-2xl font-bold">{formData.title || 'Untitled Product'}</h2>
              <p className="text-xl font-semibold text-blue-600 mt-2">
                {getPriceDisplay()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{category?.name || 'No category'}</Badge>
              <Badge variant="outline">{formatCondition(formData.condition)}</Badge>
              <Badge variant="outline" className="capitalize">
                {formData.listing_type === 'both' ? 'For Sale & Rent' : 
                 formData.listing_type === 'sell' ? 'For Sale' : 'For Rent'}
              </Badge>
            </div>

            {formData.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            )}

            {formData.listing_type === 'both' && formData.rent_price_per_month && (
              <div>
                <h3 className="font-semibold mb-2">Rental Options</h3>
                <div className="space-y-1 text-sm">
                  <p>Daily: ₹{formData.rent_price_per_day}</p>
                  <p>Monthly: ₹{formData.rent_price_per_month}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Seller:</span> Student (You)
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span> Your Hostel
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={onEdit} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </Button>
              <Button 
                onClick={onPublish} 
                disabled={isPublishing}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreview;
