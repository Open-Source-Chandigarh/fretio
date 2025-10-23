import React from 'react';
import { cn } from '@/lib/utils';
import ProductCardSkeleton from './ProductCardSkeleton';

interface GridSkeletonProps {
  className?: string;
  count?: number;
  viewMode?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

const GridSkeleton: React.FC<GridSkeletonProps> = ({
  className,
  count = 8,
  viewMode = 'grid',
  columns = 4,
}) => {
  const gridClasses = viewMode === 'grid' 
    ? {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      }
    : {
        2: 'grid-cols-1',
        3: 'grid-cols-1',
        4: 'grid-cols-1',
      };

  // Stagger class helper - cycles through stagger-1 to stagger-12
  const getStaggerClass = (index: number) => {
    const staggerIndex = (index % 12) + 1;
    return `stagger-${staggerIndex}`;
  };

  return (
    <div
      className={cn(
        'grid gap-6',
        gridClasses[columns],
        className
      )}
      role="status"
      aria-label={`Loading ${count} products...`}
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton 
          key={`skeleton-${index}`}
          viewMode={viewMode}
          className={cn(
            'animate-fade-in-up',
            getStaggerClass(index)
          )}
        />
      ))}
    </div>
  );
};

export default GridSkeleton;
