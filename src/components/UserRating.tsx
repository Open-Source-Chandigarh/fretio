import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserRatingProps {
  userId: string;
  showAvatar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface UserProfile {
  full_name: string;
  avatar_url: string;
}

interface RatingData {
  averageRating: number;
  totalReviews: number;
  profile: UserProfile;
}

const UserRating: React.FC<UserRatingProps> = ({ 
  userId, 
  showAvatar = false, 
  size = 'md' 
}) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        // Fetch user reviews and profile
        const [reviewsResponse, profileResponse] = await Promise.all([
          supabase
            .from('user_reviews')
            .select('rating')
            .eq('reviewee_id', userId),
          supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', userId)
            .single()
        ]);

        if (reviewsResponse.error || profileResponse.error) {
          throw new Error('Failed to fetch data');
        }

        const reviews = reviewsResponse.data || [];
        const profile = profileResponse.data;

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;

        setRatingData({
          averageRating,
          totalReviews,
          profile
        });
      } catch (error) {
        console.error('Error fetching rating data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, [userId]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

    return (
      <div className="flex items-center space-x-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} fill-yellow-400 text-yellow-400`} />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          avatar: 'h-6 w-6',
          text: 'text-xs',
          badge: 'text-xs px-1.5 py-0.5'
        };
      case 'lg':
        return {
          avatar: 'h-10 w-10',
          text: 'text-base',
          badge: 'text-sm px-2.5 py-1'
        };
      default:
        return {
          avatar: 'h-8 w-8',
          text: 'text-sm',
          badge: 'text-xs px-2 py-0.5'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        {showAvatar && (
          <div className={`${getSizeClasses().avatar} bg-gray-200 rounded-full`} />
        )}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} bg-gray-200 rounded`} />
          ))}
        </div>
      </div>
    );
  }

  if (!ratingData) {
    return null;
  }

  const { averageRating, totalReviews, profile } = ratingData;
  const sizeClasses = getSizeClasses();

  return (
    <div className="flex items-center space-x-2">
      {showAvatar && (
        <Avatar className={sizeClasses.avatar}>
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex items-center space-x-2">
        {renderStars(averageRating)}
        
        <span className={`${sizeClasses.text} text-muted-foreground`}>
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
        </span>
        
        {totalReviews > 0 && (
          <Badge variant="secondary" className={sizeClasses.badge}>
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </Badge>
        )}
      </div>
      
      {showAvatar && (
        <span className={`${sizeClasses.text} font-medium`}>
          {profile.full_name || 'Anonymous User'}
        </span>
      )}
    </div>
  );
};

export default UserRating;