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

  return (
    <div
      className={cn(
        'grid gap-6',
        gridClasses[columns],
        className
      )}
      role="status"
      aria-label={`Loading ${count} products...`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton 
          key={index} 
          viewMode={viewMode}
          className="animate-pulse"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default GridSkeleton;
