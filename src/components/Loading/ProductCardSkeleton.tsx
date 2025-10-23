import React from 'react';
import { cn } from '@/lib/utils';
import Skeleton, { TextSkeleton, AvatarSkeleton, ButtonSkeleton } from './Skeleton';

interface ProductCardSkeletonProps {
  className?: string;
  viewMode?: 'grid' | 'list';
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  className,
  viewMode = 'grid',
}) => {
  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex',
          className
        )}
      >
        {/* Image */}
        <div className="relative w-48 h-32 flex-shrink-0">
          <Skeleton className="w-full h-full rounded-l-2xl" />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 space-y-3">
          {/* Category + Condition */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Title */}
          <TextSkeleton lines={2} />

          {/* Price */}
          <Skeleton className="h-8 w-24" />

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <AvatarSkeleton size="sm" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Button */}
          <ButtonSkeleton className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        'group bg-card rounded-2xl border border-border/60 shadow-md hover:shadow-xl overflow-hidden',
        'transition-all duration-300 hover:-translate-y-1',
        className
      )}
      role="status"
      aria-label="Loading product..."
      aria-busy="true"
    >
      {/* Image Container - Enhanced with multiple action placeholders */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Skeleton className="w-full h-full rounded-t-2xl" />
        
        {/* Floating Action Buttons (matching enhanced ProductCard) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Skeleton shape="circle" className="w-9 h-9 backdrop-blur-sm" />
          <Skeleton shape="circle" className="w-9 h-9 backdrop-blur-sm" />
          <Skeleton shape="circle" className="w-9 h-9 backdrop-blur-sm" />
        </div>

        {/* Rent badge placeholder with pulse */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-20 h-7 rounded-md animate-skeleton-pulse" />
        </div>

        {/* Image navigation dots placeholder */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <Skeleton shape="circle" className="w-2 h-2" />
          <Skeleton shape="circle" className="w-2 h-2" />
          <Skeleton shape="circle" className="w-2 h-2" />
        </div>

        {/* Views indicator */}
        <div className="absolute bottom-3 right-3">
          <Skeleton className="w-14 h-6 rounded-full backdrop-blur-sm" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3.5">
        {/* Category + Condition Badges */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Title - Two lines */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Seller Info Section */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-2.5">
            <AvatarSkeleton size="sm" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-14" /> {/* Rating stars */}
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" /> {/* Clock icon */}
            <Skeleton className="h-3 w-14" />
          </div>
        </div>

        {/* CTA Button */}
        <ButtonSkeleton className="w-full mt-2" />
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
