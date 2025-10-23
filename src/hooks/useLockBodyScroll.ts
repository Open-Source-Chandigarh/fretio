import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals, lightboxes, and overlays
 * 
 * @param lock - Whether to lock the body scroll
 */
export const useLockBodyScroll = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return;

    // Store original body styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup function to restore original styles
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [lock]);
};

