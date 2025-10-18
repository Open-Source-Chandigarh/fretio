// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import DevTools from "./pages/DevTools";
import AdminDashboard from "./pages/AdminDashboard";
// import Marketplace from "./pages/Marketplace";
import MarketplaceSimple from "./pages/MarketplaceSimple";
import CreateProduct from "./pages/CreateProduct";
import MyProducts from "./pages/MyProducts";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import TestSupabase from "./pages/TestSupabase";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation";

const queryClient = new QueryClient();

const ScrollToTopMount: React.FC = () => {
  const location = useLocation();
  const hiddenRoutes = ["/auth"]; // hide on login/signup page
  const isHidden = hiddenRoutes.includes(location.pathname);
  return isHidden ? null : <ScrollToTopButton />;
};

const AppInner = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dev-tools"
        element={
          <ProtectedRoute>
            <DevTools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireVerified>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={<MarketplaceSimple />}
      />
      <Route path="/test-supabase" element={<TestSupabase />} />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute requireVerified>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-product"
        element={
          <ProtectedRoute requireVerified>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-products"
        element={
          <ProtectedRoute requireVerified>
            <MyProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute requireVerified>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute requireVerified>
            <Reviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute requireVerified>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute requireVerified>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <ScrollToTopMount />
    <Footer />
    <MobileNavigation />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppInner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
