"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  MessageCircle,
  Search,
  LogOut,
  Settings,
  ShieldCheck,
  Bell,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getVerificationBadge = () => {
    if (!profile) return null;

    switch (profile.verification_status) {
      case "verified":
        return <Badge variant="default" className="text-xs bg-teal-100 text-teal-700">Verified</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return null;
    }
  };

  interface NavLinkProps {
    to: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }

  const NavLink = ({ to, label, icon: Icon }: NavLinkProps) => (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "relative flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-teal-600 group",
        location.pathname === to ? "text-teal-600" : "text-slate-500"
      )}
    >
      {Icon && <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
      {label}
      {location.pathname === to && (
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-teal-500 rounded-full"></span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 dark:bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Fretio
            </span>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/marketplace" label="Browse" icon={Search} />
            <NavLink to="/my-products" label="My Listings" icon={ShoppingBag} />
            <NavLink to="/favorites" label="Favorites" icon={Star} />
            <NavLink to="/messages" label="Messages" icon={MessageCircle} />
            <NavLink to="/notifications" label="Notifications" icon={Bell} />
            <NavLink to="/reviews" label="Reviews" />
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <>
                {/* Avatar + Menu */}
                <div className="flex items-center space-x-2">
                  {getVerificationBadge()}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full hover:bg-teal-50 transition-all duration-200 hover:scale-105"
                      >
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-400 text-white font-semibold">
                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl shadow-xl" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      {(profile?.role === "admin" || profile?.role === "super_admin") && (
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {profile?.verification_status === "verified" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-hero text-white shadow hover:shadow-md transition-all"
                      onClick={() => navigate("/create-product")}
                    >
                      Sell Item
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-hero text-white shadow hover:shadow-md"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-teal-50 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 py-4 space-y-4 bg-background/95 dark:bg-background/98 backdrop-blur-md rounded-b-2xl shadow-lg">
            <nav className="flex flex-col space-y-3 text-slate-600">
              <NavLink to="/marketplace" label="Browse" icon={Search} />
              <NavLink to="/my-products" label="My Listings" icon={ShoppingBag} />
              <NavLink to="/favorites" label="Favorites" icon={Star} />
              <NavLink to="/messages" label="Messages" icon={MessageCircle} />
              <NavLink to="/notifications" label="Notifications" icon={Bell} />
              <NavLink to="/reviews" label="Reviews" />
            </nav>

            <div className="pt-4 border-t space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-slate-200">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "User"} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    {getVerificationBadge()}
                  </div>
                  {profile?.verification_status === "verified" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-hero text-white"
                      onClick={() => navigate("/create-product")}
                    >
                      Sell Item
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                    <User className="h-4 w-4 mr-2" /> Login
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-hero text-white"
                    onClick={() => navigate("/auth")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
