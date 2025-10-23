# 📝 Example Implementations for UI Improvements

> Code examples demonstrating the proposed UI enhancements

---

## 1. Enhanced Product Card Component

### File: `src/components/EnhancedProductCard.tsx`

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Clock, 
  User, 
  MapPin,
  Share2,
  Maximize2,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface EnhancedProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair";
  images: string[];
  seller: {
    name: string;
    room: string;
    rating: number;
    id?: string;
    isVerified?: boolean;
  };
  category: string;
  categoryIcon?: React.ComponentType<{ className?: string }>;
  timeAgo: string;
  views?: number;
  distance?: number; // in km
  isForRent?: boolean;
  rentPricePerDay?: number;
  isNew?: boolean; // Listed in last 24h
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onQuickView?: () => void;
  onShare?: () => void;
}

// Condition styling with enhanced colors
const conditionStyles = {
  new: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "🌟"
  },
  "like-new": {
    bg: "bg-sky-50 dark:bg-sky-950",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800",
    icon: "✨"
  },
  good: {
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "👍"
  },
  fair: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "👌"
  }
};

export const EnhancedProductCard = ({
  id,
  title,
  price,
  condition,
  images,
  seller,
  category,
  categoryIcon: CategoryIcon,
  timeAgo,
  views = 0,
  distance,
  isForRent = false,
  rentPricePerDay,
  isNew = false,
  isFavorited = false,
  onFavoriteToggle,
  onQuickView,
  onShare,
}: EnhancedProductCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const conditionStyle = conditionStyles[condition];

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleQuickAction = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card rounded-2xl border border-border/60",
        "shadow-fretio-sm hover:shadow-fretio-xl",
        "transition-all duration-300 overflow-hidden cursor-pointer",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      )}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* Main Image with Zoom Effect */}
        <motion.img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient Overlay on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            />
          )}
        </AnimatePresence>

        {/* Quick Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ staggerChildren: 0.1 }}
              className="absolute top-3 right-3 flex flex-col gap-2 z-10"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  onClick={(e) => handleQuickAction(e, onQuickView || (() => {}))}
                  aria-label="Quick view"
                >
                  <Maximize2 className="h-4 w-4 text-slate-700" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  onClick={(e) => handleQuickAction(e, onShare || (() => {}))}
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4 text-slate-700" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    "h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg",
                    isFavorited && "bg-red-50"
                  )}
                  onClick={(e) => handleQuickAction(e, onFavoriteToggle || (() => {}))}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={cn(
                      "h-4 w-4",
                      isFavorited ? "fill-red-500 text-red-500" : "text-slate-700"
                    )}
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
              🔥 New
            </Badge>
          )}
          {isForRent && (
            <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 shadow-md">
              📍 For Rent
            </Badge>
          )}
          {seller.isVerified && (
            <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700 shadow-md">
              ✓ Verified Seller
            </Badge>
          )}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Views & Distance */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            {distance !== undefined && (
              <div className="flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                <MapPin className="h-3 w-3" />
                <span>{distance} km</span>
              </div>
            )}
          </div>

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="flex gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === currentImageIndex 
                      ? "w-6 bg-white" 
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        {/* Category + Condition */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {CategoryIcon && <CategoryIcon className="h-3 w-3 mr-1" />}
            {category}
          </Badge>
          <Badge
            className={cn(
              "text-xs border rounded-full px-3 py-1",
              conditionStyle.bg,
              conditionStyle.text,
              conditionStyle.border
            )}
          >
            <span className="mr-1">{conditionStyle.icon}</span>
            {condition.replace("-", " ")}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug min-h-[3.5rem]">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ₹{price.toLocaleString()}
          </span>
          {isForRent && rentPricePerDay && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              / ₹{rentPricePerDay} per day
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-9 w-9 border-2 border-slate-200 dark:border-slate-700 ring-2 ring-offset-1 ring-transparent group-hover:ring-amber-400 transition-all">
              <AvatarImage src={seller.avatar} alt={seller.name} />
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-400 text-white text-xs font-semibold">
                {seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {seller.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="truncate">Room {seller.room}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  ⭐ {seller.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-2">
            <Clock className="h-3 w-3" />
            <span className="whitespace-nowrap">{timeAgo}</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className={cn(
              "w-full mt-3",
              "border-amber-200 dark:border-amber-800",
              "text-amber-600 dark:text-amber-400",
              "hover:bg-amber-50 dark:hover:bg-amber-950",
              "hover:text-amber-700 dark:hover:text-amber-300",
              "hover:border-amber-300 dark:hover:border-amber-700",
              "transition-all duration-200",
              "font-medium"
            )}
            onClick={(e) => {
              e.stopPropagation();
              // Handle message seller
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Seller
          </Button>
        </motion.div>
      </div>

      {/* Glassmorphism Overlay on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-500/5 via-transparent to-teal-500/5 rounded-2xl"
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default EnhancedProductCard;
```

---

## 2. Animated Stats Counter Component

### File: `src/components/ui/stats-counter.tsx`

```typescript
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface StatsCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  separator?: string;
}

export const StatsCounter = ({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0,
  separator = ",",
}: StatsCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const spring = useSpring(0, {
    duration,
    bounce: 0,
  });
  
  const display = useTransform(spring, (current) => {
    const value = current.toFixed(decimals);
    return formatNumber(parseFloat(value), separator);
  });
  
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      spring.set(end);
    }
  }, [isInView, end, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  function formatNumber(num: number, sep: string): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

// Usage Example
export const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50/30 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
              <StatsCounter end={5000} suffix="+" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Products Listed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
              <StatsCounter end={2000} suffix="+" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Active Students
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
              <StatsCounter end={10000} suffix="+" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Successful Trades
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              <StatsCounter end={4.8} decimals={1} />
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Average Rating
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
```

---

## 3. Filter Chips Component

### File: `src/components/ui/filter-chip.tsx`

```typescript
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  icon?: React.ReactNode;
  onRemove: () => void;
  variant?: "default" | "category" | "price" | "condition";
}

const variantStyles = {
  default: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  category: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  price: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  condition: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
};

export const FilterChip = ({
  label,
  icon,
  onRemove,
  variant = "default",
}: FilterChipProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
        "transition-all duration-200",
        variantStyles[variant]
      )}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="ml-1 hover:bg-white/50 dark:hover:bg-black/30 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </motion.button>
    </motion.div>
  );
};

// Usage Example
export const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
        Active Filters:
      </span>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          icon={filter.icon}
          variant={filter.type}
          onRemove={() => onRemoveFilter(filter.id)}
        />
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
```

---

## 4. Scroll Animation Hook

### File: `src/hooks/useScrollAnimation.ts`

```typescript
import { useEffect, RefObject } from "react";
import { useInView } from "framer-motion";

export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  callback?: () => void
) => {
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  useEffect(() => {
    if (isInView && callback) {
      callback();
    }
  }, [isInView, callback]);

  return isInView;
};

// Utility for adding classes on scroll
export const useScrollReveal = (
  ref: RefObject<HTMLElement>,
  className: string = "revealed"
) => {
  const isInView = useScrollAnimation(ref);

  useEffect(() => {
    if (isInView && ref.current) {
      ref.current.classList.add(className);
    }
  }, [isInView, ref, className]);

  return isInView;
};
```

---

## 5. Enhanced CSS Animations

### File: `src/styles/animations.css`

```css
/* Scroll Reveal Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-up.revealed {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-left.revealed {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger Animation */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
}

.stagger-container.revealed .stagger-item {
  animation: staggerFadeIn 0.5s ease-out forwards;
}

.stagger-container.revealed .stagger-item:nth-child(1) {
  animation-delay: 0.1s;
}

.stagger-container.revealed .stagger-item:nth-child(2) {
  animation-delay: 0.2s;
}

.stagger-container.revealed .stagger-item:nth-child(3) {
  animation-delay: 0.3s;
}

.stagger-container.revealed .stagger-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes staggerFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer Loading Effect */
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Pulse Animation for Notifications */
.pulse-dot {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Smooth Color Transitions */
.smooth-color-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Ripple Effect */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}

/* Floating Animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass morphism */
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Color System Update

### File: `src/index.css` (additions)

```css
@layer base {
  :root {
    /* Enhanced Color System */
    --color-amber-50: 255 251 235;
    --color-amber-100: 254 243 199;
    --color-amber-200: 253 230 138;
    --color-amber-300: 252 211 77;
    --color-amber-400: 251 191 36;
    --color-amber-500: 245 158 11;
    --color-amber-600: 217 119 6;
    --color-amber-700: 180 83 9;
    --color-amber-800: 146 64 14;
    --color-amber-900: 120 53 15;

    --color-teal-50: 240 253 250;
    --color-teal-100: 204 251 241;
    --color-teal-200: 153 246 228;
    --color-teal-300: 94 234 212;
    --color-teal-400: 45 212 191;
    --color-teal-500: 20 184 166;
    --color-teal-600: 13 148 136;
    --color-teal-700: 15 118 110;
    --color-teal-800: 17 94 89;
    --color-teal-900: 19 78 74;

    /* Category-specific colors */
    --category-books: 139 92 246;       /* Purple */
    --category-electronics: 59 130 246;  /* Blue */
    --category-furniture: 245 158 11;    /* Amber */
    --category-clothing: 236 72 153;     /* Pink */
    --category-sports: 16 185 129;       /* Green */
    --category-other: 107 114 128;       /* Gray */

    /* Semantic colors */
    --semantic-success: 16 185 129;
    --semantic-warning: 245 158 11;
    --semantic-error: 239 68 68;
    --semantic-info: 59 130 246;

    /* Enhanced shadows */
    --shadow-colored-sm: 0 2px 8px rgba(245, 158, 11, 0.1);
    --shadow-colored-md: 0 4px 16px rgba(245, 158, 11, 0.15);
    --shadow-colored-lg: 0 8px 24px rgba(245, 158, 11, 0.2);
    --shadow-colored-xl: 0 16px 48px rgba(245, 158, 11, 0.25);

    /* Gradients */
    --gradient-amber: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    --gradient-teal: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    --gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    --gradient-rainbow: linear-gradient(135deg, #f59e0b 0%, #14b8a6 50%, #8b5cf6 100%);
  }

  .dark {
    /* Dark mode color adjustments */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    /* Adjust shadows for dark mode */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }
}

/* Utility classes for categories */
.category-books { color: rgb(var(--category-books)); }
.category-electronics { color: rgb(var(--category-electronics)); }
.category-furniture { color: rgb(var(--category-furniture)); }
.category-clothing { color: rgb(var(--category-clothing)); }
.category-sports { color: rgb(var(--category-sports)); }

/* Semantic color utilities */
.text-success { color: rgb(var(--semantic-success)); }
.text-warning { color: rgb(var(--semantic-warning)); }
.text-error { color: rgb(var(--semantic-error)); }
.text-info { color: rgb(var(--semantic-info)); }

.bg-success { background-color: rgb(var(--semantic-success)); }
.bg-warning { background-color: rgb(var(--semantic-warning)); }
.bg-error { background-color: rgb(var(--semantic-error)); }
.bg-info { background-color: rgb(var(--semantic-info)); }
```

---

## Testing the Implementations

### Manual Testing Checklist

```typescript
// Test EnhancedProductCard
✅ Hover animations work smoothly
✅ Quick action buttons appear/disappear correctly
✅ Image carousel indicators work
✅ Favorite button toggles state
✅ All accessibility features work (keyboard navigation, ARIA labels)
✅ Dark mode styling is correct
✅ Responsive on mobile devices

// Test StatsCounter
✅ Numbers animate on scroll into view
✅ Animation triggers only once
✅ Formatting works correctly (commas, decimals)
✅ Works with different durations

// Test FilterChips
✅ Chips animate in/out smoothly
✅ Remove button works
✅ Different variants have correct colors
✅ Clear all button works when multiple chips

// Test Animations
✅ Scroll animations trigger at correct viewport position
✅ Reduced motion preference is respected
✅ Performance is smooth (60fps)
✅ No layout shift occurs
```

---

**Note:** These are example implementations. Adjust based on your specific requirements and existing codebase structure.



