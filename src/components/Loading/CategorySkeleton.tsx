import React from 'react';
import { cn } from '@/lib/utils';
import Skeleton from './Skeleton';

interface CategorySkeletonProps {
  className?: string;
}

/**
 * CategorySkeleton - Loading placeholder for category cards
 * Matches the CategoryGrid component structure
 */
const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'group relative bg-card rounded-2xl p-6 border border-border/60 shadow-sm',
        'hover:shadow-lg transition-all duration-300 overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading category..."
      aria-busy="true"
    >
      {/* Icon placeholder */}
      <div className="mb-4 flex items-center justify-center">
        <Skeleton shape="circle" className="w-12 h-12" />
      </div>

      {/* Category name */}
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />

      {/* Product count */}
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
  );
};

/**
 * CategoryGridSkeleton - Grid of category skeletons with staggered loading
 */
export const CategoryGridSkeleton: React.FC<{
  className?: string;
  count?: number;
}> = ({ className, count = 8 }) => {
  // Stagger class helper
  const getStaggerClass = (index: number) => {
    const staggerIndex = (index % 12) + 1;
    return `stagger-${staggerIndex}`;
  };

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6',
        className
      )}
      role="status"
      aria-label={`Loading ${count} categories...`}
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CategorySkeleton
          key={`category-skeleton-${index}`}
          className={cn(
            'animate-fade-in-up',
            getStaggerClass(index)
          )}
        />
      ))}
    </div>
  );
};

export default CategorySkeleton;

