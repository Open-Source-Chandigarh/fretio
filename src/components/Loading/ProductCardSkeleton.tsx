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
    <div
      className={cn(
        'bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading product..."
    >
      {/* Image */}
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-t-2xl" />
        
        {/* Views indicator */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>

        {/* Rent badge placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-16 h-6 rounded" />
        </div>

        {/* Heart button placeholder */}
        <div className="absolute top-3 right-3">
          <Skeleton shape="circle" className="w-9 h-9" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        {/* Category + Condition */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <AvatarSkeleton size="sm" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" /> {/* Rating */}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Skeleton className="h-3 w-3 rounded-full" /> {/* Clock icon */}
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Button */}
        <ButtonSkeleton className="w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
