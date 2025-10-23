import React from 'react';
import { cn } from '@/lib/utils';
import Skeleton, { TextSkeleton, AvatarSkeleton, ButtonSkeleton } from './Skeleton';

interface ProductDetailSkeletonProps {
  className?: string;
}

const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)} role="status" aria-busy="true">
      {/* Header Placeholder */}
      <div className="h-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-5 flex items-center justify-between h-full">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in-up stagger-1">
          <ButtonSkeleton size="sm" width={100} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in-up stagger-2">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
              
              {/* Navigation Buttons */}
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Skeleton shape="circle" className="w-10 h-10 backdrop-blur-sm" />
                <Skeleton shape="circle" className="w-10 h-10 backdrop-blur-sm" />
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4">
                <Skeleton className="w-12 h-6 rounded-full backdrop-blur-sm" />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={`thumb-${index}`}
                  className="flex-shrink-0 w-16 h-16 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up stagger-3">
            {/* Category & Status */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <TextSkeleton lines={4} />
            </div>

            {/* Seller Info */}
            <div className="border border-border/60 bg-card/50 rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-20" />
              
              <div className="flex items-center space-x-4">
                <AvatarSkeleton size="lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              <div className="flex gap-3">
                <ButtonSkeleton className="flex-1" />
                <ButtonSkeleton size="md" width={120} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <ButtonSkeleton className="flex-1" size="lg" />
              <ButtonSkeleton size="lg" width={48} />
              <ButtonSkeleton size="lg" width={48} />
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="bg-card rounded-xl border border-border/60 p-6 mb-8 space-y-6 animate-fade-in-up stagger-4">
          <Skeleton className="h-6 w-32" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`detail-${index}`} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="space-y-6 animate-fade-in-up stagger-5">
          <Skeleton className="h-7 w-40" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`similar-${index}`}
                className={cn(
                  'bg-card rounded-xl border border-border/60 overflow-hidden',
                  'animate-fade-in-up',
                  `stagger-${(index % 12) + 1}`
                )}
              >
                <Skeleton className="w-full aspect-square" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailSkeleton;
