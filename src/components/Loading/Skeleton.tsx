import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
  shape?: 'rectangle' | 'circle' | 'rounded';
  variant?: 'default' | 'text' | 'avatar' | 'button';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  shape = 'rectangle',
  variant = 'default',
  style,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200 bg-[length:200%_100%]';
  
  const shapeClasses = {
    rectangle: 'rounded-md',
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const variantClasses = {
    default: 'bg-slate-200',
    text: 'bg-slate-200 h-4',
    avatar: 'bg-slate-200 rounded-full',
    button: 'bg-slate-200 rounded-md h-10',
  };

  const computedStyle = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={cn(
        baseClasses,
        shapeClasses[shape],
        variantClasses[variant],
        'animate-shimmer',
        className
      )}
      style={computedStyle}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
};

// Text skeleton for single lines
export const TextSkeleton: React.FC<{
  className?: string;
  width?: string | number;
  lines?: number;
}> = ({ className, width, lines = 1 }) => {
  if (lines === 1) {
    return <Skeleton variant="text" width={width} className={className} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
export const AvatarSkeleton: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <Skeleton
      shape="circle"
      className={cn(sizes[size], className)}
    />
  );
};

// Button skeleton
export const ButtonSkeleton: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
}> = ({ className, size = 'md', width }) => {
  const sizes = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6',
  };

  return (
    <Skeleton
      variant="button"
      width={width}
      className={cn(sizes[size], className)}
    />
  );
};

export default Skeleton;
