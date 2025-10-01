import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, ShoppingBag, MessageCircle, Search, LogOut, Settings, Shield } from "lucide-react";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getVerificationBadge = () => {
    if (!profile) return null;
    
    switch (profile.verification_status) {
      case 'verified':
        return <Badge variant="default" className="text-xs">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate("/")} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Fretio
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigate("/marketplace")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/marketplace" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Browse Products
            </button>
            <button 
              onClick={() => navigate("/my-products")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/my-products" ? "text-primary" : "text-muted-foreground"
              )}
            >
              My Listings
            </button>
            <button 
              onClick={() => navigate("/favorites")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/favorites" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Favorites
            </button>
            <button 
              onClick={() => navigate("/messages")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/messages" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Messages
            </button>
            <button 
              onClick={() => navigate("/notifications")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/notifications" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Notifications
            </button>
            <button 
              onClick={() => navigate("/reviews")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/reviews" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Reviews
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            {user && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/messages")}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-2">
                {getVerificationBadge()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dev-tools')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dev Tools</span>
                    </DropdownMenuItem>
                    {(profile?.role === 'admin' || profile?.role === 'super_admin') && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {profile?.verification_status === 'verified' && (
                <Button 
                  variant="accent" 
                  size="sm"
                  onClick={() => navigate('/create-product')}
                >
                  Sell Item
                </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  variant="accent" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => navigate("/marketplace")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Browse Products
              </button>
              <button 
                onClick={() => navigate("/my-products")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                My Listings
              </button>
              <button 
                onClick={() => navigate("/favorites")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Favorites
              </button>
              <button 
                onClick={() => navigate("/messages")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Messages
              </button>
              <button 
                onClick={() => navigate("/notifications")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Notifications
              </button>
              <button 
                onClick={() => navigate("/reviews")}
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Reviews
              </button>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {getVerificationBadge()}
                      </div>
                    </div>
                  </div>
                  {profile?.verification_status === 'verified' && (
                  <Button 
                    variant="accent" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/create-product')}
                  >
                    Sell Item
                  </Button>
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    variant="accent" 
                    size="sm"
                    onClick={() => navigate('/auth')}
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