import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  isActive: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

/**
 * Custom hook for keyboard navigation in lightbox
 * Handles arrow keys, escape, space, and zoom controls
 * 
 * @param props - Navigation callbacks and active state
 */
export const useKeyboardNavigation = ({
  isActive,
  onPrevious,
  onNext,
  onClose,
  onZoomIn,
  onZoomOut,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
        case ' ': // Space key
          event.preventDefault();
          onNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case '+':
        case '=':
          if (onZoomIn) {
            event.preventDefault();
            onZoomIn();
          }
          break;
        case '-':
        case '_':
          if (onZoomOut) {
            event.preventDefault();
            onZoomOut();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onPrevious, onNext, onClose, onZoomIn, onZoomOut]);
};

