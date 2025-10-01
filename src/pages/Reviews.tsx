import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, MessageSquare, Calendar, User, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_id: string;
  reviewee_id: string;
  product_id?: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

const Reviews = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    reviewee_id: '',
    product_id: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Check if we need to show review form for a specific user/product
  const revieweeId = searchParams.get('reviewee');
  const productId = searchParams.get('product');

  useEffect(() => {
    if (revieweeId) {
      setNewReview(prev => ({ ...prev, reviewee_id: revieweeId, product_id: productId || '' }));
      setShowForm(true);
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .or(`reviewer_id.eq.${user?.id},reviewee_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview.reviewee_id || !newReview.comment.trim()) return;

    try {
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          reviewer_id: user.id,
          reviewee_id: newReview.reviewee_id,
          product_id: newReview.product_id || null,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });

      setNewReview({ rating: 5, comment: '', reviewee_id: '', product_id: '' });
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading reviews...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Reviews</h1>
              <p className="text-muted-foreground">
                Manage your reviews and ratings
              </p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>
                  Share your experience with other users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <div className="mt-2">
                      {renderStars(newReview.rating, true, (rating) =>
                        setNewReview(prev => ({ ...prev, rating }))
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={!newReview.comment.trim()}>
                      Submit Review
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Start by writing your first review or complete a transaction to receive reviews.
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {review.reviewer_id === user?.id ? 'Your Review' : 'Anonymous User'}
                            </span>
                            {review.reviewer_id === user?.id ? (
                              <Badge variant="secondary">Your review</Badge>
                            ) : (
                              <Badge variant="outline">Review for you</Badge>
                            )}
                          </div>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{review.comment}</p>

                    {review.product_id && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        <span>Related to a product transaction</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;