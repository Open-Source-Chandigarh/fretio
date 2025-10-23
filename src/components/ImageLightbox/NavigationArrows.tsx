import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
}

const NavigationArrows = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  className,
}: NavigationArrowsProps) => {
  return (
    <>
      {/* Previous Arrow */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-20",
            "h-12 w-12 rounded-full",
            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
            "text-white border border-white/20",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50",
            className
          )}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Next Arrow */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-20",
            "h-12 w-12 rounded-full",
            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
            "text-white border border-white/20",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50",
            className
          )}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default NavigationArrows;

