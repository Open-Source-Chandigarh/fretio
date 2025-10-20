import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  ShoppingBag,
  MessageCircle,
  User,
  Plus,
  Heart,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "search", label: "Browse", icon: Search, path: "/marketplace" },
    { id: "create", label: "Sell", icon: Plus, path: "/create-product" },
    { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages", badge: 3 },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location]);

  const handleNavigation = (item: NavItem) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(item);
    }
  };

  // Hide on certain pages
  const hiddenPaths = ["/auth", "/complete-profile"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border" />
      
      {/* Navigation items */}
      <nav className="relative flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCreate = item.id === "create";

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              aria-label={`${item.label}${item.badge ? ` (${item.badge} unread)` : ''}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive && !isCreate && "bg-primary/10",
                isCreate && "bg-gradient-to-r from-primary to-accent"
              )}
              style={{ flex: 1 }}
            >
              {/* Special styling for create button */}
              {isCreate ? (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg"
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs mt-1 transition-colors",
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}

              {/* Active indicator */}
              {isActive && !isCreate && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 -bottom-2 h-0.5 bg-primary rounded-full"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Alternative bottom navigation with more items
export const ExtendedMobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const mainItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "search", label: "Browse", icon: Search, path: "/marketplace" },
    { id: "favorites", label: "Saved", icon: Heart, path: "/favorites" },
    { id: "notifications", label: "Alerts", icon: Bell, path: "/notifications", badge: 5 },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-t border-border" />
        
        <nav className="relative flex items-center justify-around px-2 py-1 safe-area-bottom">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(item.path);
                  }
                }}
                aria-label={`${item.label}${item.badge ? ` (${item.badge} unread)` : ''}`}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ flex: 1 }}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 transition-colors",
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Floating Action Button for Create */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/create-product")}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate("/create-product");
          }
        }}
        aria-label="Create new product listing"
        className="fixed bottom-20 right-4 z-50 md:hidden w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>
    </>
  );
};

export default MobileNavigation;
