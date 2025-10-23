import { useRef, useEffect, TouchEvent } from 'react';

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  isActive?: boolean;
}

/**
 * Custom hook for detecting swipe gestures on mobile
 * 
 * @param props - Swipe callbacks and configuration
 * @returns Touch event handlers
 */
export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  isActive = true,
}: UseSwipeGestureProps) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (!isActive) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isActive) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isActive) return;
    
    const deltaX = touchStartX.current - touchEndX.current;
    
    // Swipe left (next image)
    if (deltaX > threshold) {
      onSwipeLeft();
    }
    
    // Swipe right (previous image)
    if (deltaX < -threshold) {
      onSwipeRight();
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

