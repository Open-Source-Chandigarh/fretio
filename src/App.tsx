import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import DevTools from "./pages/DevTools";
import AdminDashboard from "./pages/AdminDashboard";
import Marketplace from "./pages/Marketplace";
import CreateProduct from "./pages/CreateProduct";
import MyProducts from "./pages/MyProducts";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/complete-profile" element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dev-tools" element={
              <ProtectedRoute>
                <DevTools />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireVerified>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute requireVerified>
                <Marketplace />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute requireVerified>
                <ProductDetail />
              </ProtectedRoute>
            } />
            <Route path="/create-product" element={
              <ProtectedRoute requireVerified>
                <CreateProduct />
              </ProtectedRoute>
            } />
            <Route path="/my-products" element={
              <ProtectedRoute requireVerified>
                <MyProducts />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute requireVerified>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={
              <ProtectedRoute requireVerified>
                <Reviews />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute requireVerified>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute requireVerified>
                <Notifications />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
