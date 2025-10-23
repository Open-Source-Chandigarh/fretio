import { useRef, TouchEvent } from 'react';

interface UsePinchZoomProps {
  minZoom: number;
  maxZoom: number;
  onZoomChange: (zoom: number) => void;
  isActive?: boolean;
}

/**
 * Custom hook for pinch-to-zoom gesture on mobile
 * 
 * @param props - Zoom configuration and callbacks
 * @returns Touch event handlers for pinch zoom
 */
export const usePinchZoom = ({
  minZoom,
  maxZoom,
  onZoomChange,
  isActive = true,
}: UsePinchZoomProps) => {
  const initialDistance = useRef<number>(0);
  const currentZoom = useRef<number>(1);

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isActive || e.touches.length !== 2) return;
    
    initialDistance.current = getDistance(e.touches[0], e.touches[1]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isActive || e.touches.length !== 2 || initialDistance.current === 0) return;
    
    e.preventDefault(); // Prevent default zoom behavior
    
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance.current;
    
    // Calculate new zoom level
    let newZoom = currentZoom.current * scale;
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    onZoomChange(newZoom);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isActive) return;
    
    if (e.touches.length < 2) {
      // Update current zoom when pinch ends
      initialDistance.current = 0;
    }
  };

  const updateCurrentZoom = (zoom: number) => {
    currentZoom.current = zoom;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    updateCurrentZoom,
  };
};

