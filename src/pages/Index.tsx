import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import { supabase } from "@/integrations/supabase/client";

// Interface for database products
interface Product {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  condition: string;
  status: string;
  created_at: string;
  views_count?: number;
  seller_id: string;
  is_featured?: boolean;
  categories: {
    name: string;
  } | null;
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
}

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      // Only redirect if profile is incomplete
      if (!profile || !profile.is_active || profile.verification_status !== "verified") {
        navigate("/complete-profile");
      }
      // Remove auto-redirect to marketplace - let users see the home page
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (image_url, is_primary, sort_order)
        `)
        .eq('status', 'available')
        .order('views_count', { ascending: false })
        .limit(4);

      if (error) throw error;

      // Format products for ProductCard component
      const formattedProducts = (data || []).map(product => formatProductForCard(product));
      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to sample images if database fetch fails
      setFeaturedProducts([
        {
          id: "1",
          title: "Engineering Mechanics Textbook",
          price: 450,
          condition: "like-new" as const,
          images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600"],
          seller: { name: "Arjun K", room: "A-204", rating: 4.8 },
          category: "Books",
          timeAgo: "2h ago",
          views: 23,
          isForRent: false,
        },
        {
          id: "2",
          title: "Gaming Laptop - ROG Strix G15",
          price: 35000,
          condition: "good" as const,
          images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"],
          seller: { name: "Priya S", room: "B-156", rating: 4.9 },
          category: "Electronics",
          timeAgo: "5h ago",
          views: 67,
          isForRent: true,
          rentPricePerDay: 500,
        },
        {
          id: "3",
          title: "Study Chair with Cushion",
          price: 1200,
          condition: "new" as const,
          images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"],
          seller: { name: "Rahul M", room: "C-89", rating: 4.7 },
          category: "Furniture",
          timeAgo: "1d ago",
          views: 45,
          isForRent: false,
        },
        {
          id: "4",
          title: "Guitar - Yamaha F310",
          price: 8500,
          condition: "good" as const,
          images: ["https://images.unsplash.com/photo-1525201548942-d8732f6b4a07?w=600"],
          seller: { name: "Neha D", room: "A-67", rating: 5.0 },
          category: "Music",
          timeAgo: "3d ago",
          views: 89,
          isForRent: true,
          rentPricePerDay: 150,
        },
      ]);
    } finally {
      setProductsLoading(false);
    }
  };

  const formatProductForCard = (product: Product) => {
    // Use actual images from database or Unsplash fallbacks
    const images = product.product_images && product.product_images.length > 0
      ? product.product_images
          .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : a.sort_order - b.sort_order))
          .map(img => img.image_url)
      : getDefaultProductImage(product.categories?.name || 'Other');

    const timeAgo = () => {
      const created = new Date(product.created_at);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return "just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "1d ago";
      return `${diffDays}d ago`;
    };

    return {
      id: product.id,
      title: product.title,
      price: product.sell_price || product.rent_price_per_day || 0,
      condition: (product.condition?.replace('_', '-') || 'good') as "new" | "like-new" | "good" | "fair",
      images: Array.isArray(images) ? images : [images],
      seller: {
        id: product.seller_id,
        name: "Student Seller",
        room: "A-" + Math.floor(Math.random() * 300 + 1),
        rating: 4.5 + Math.random() * 0.5
      },
      category: product.categories?.name || "Other",
      timeAgo: timeAgo(),
      views: product.views_count || 0,
      isForRent: product.rent_price_per_day !== null,
      rentPricePerDay: product.rent_price_per_day || undefined
    };
  };

  // Get default image based on category
  const getDefaultProductImage = (category: string): string[] => {
    const categoryImages: { [key: string]: string } = {
      'Books & Study Material': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600',
      'Electronics': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600',
      'Clothing & Fashion': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
      'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'Sports & Fitness': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
      'Gaming': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600',
      'Kitchen & Appliances': 'https://images.unsplash.com/photo-1565452372282-0638fa9ad973?w=600',
      'Other': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    };
    return [categoryImages[category] || categoryImages['Other']];
  };

  // Show loading state
  if (loading) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoryGrid />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Featured Products
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/marketplace")}
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsLoading ? (
                // Loading skeleton
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/60 animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-2xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-8 bg-muted rounded w-1/2"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </div>
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                // Fallback message if no products
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">No featured products available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-blue-50/40">
          <div className="container mx-auto px-4">
            <PersonalizedRecommendations
              title="Discover Amazing Products"
              subtitle="Trending items from your hostel community"
              maxItems={8}
              showTrending={true}
            />
          </div>
        </section>

        <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
          {/* Floating decorative circles */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-amber-400/20 filter blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-teal-400/20 filter blur-3xl animate-float-reverse" />

          <div className="container relative mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                Why Choose Fretio?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
                Built specifically for hostel communities to foster trust,
                safety, and simplicity.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="cursor-pointer group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-100 to-teal-300 shadow-inner transition-transform duration-500 group-hover:scale-110 mx-auto">
                  <Users className="w-12 h-12 text-teal-700" />
                </div>
                <h3 className="text-2xl font-bold mt-6 mb-3 text-slate-900">
                  Hostel Community
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Connect exclusively with students from your hostel. Build
                  trust and familiarity where it matters most.
                </p>
              </div>

              {/* Card 2 */}
              <div className="cursor-pointer group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-indigo-300 shadow-inner transition-transform duration-500 group-hover:scale-110 mx-auto">
                  <Shield className="w-12 h-12 text-indigo-700" />
                </div>
                <h3 className="text-2xl font-bold mt-6 mb-3 text-slate-900">
                  Verified Students
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Every member verifies their student ID, ensuring trades are
                  safe, authentic, and within your hostel network.
                </p>
              </div>

              {/* Card 3 */}
              <div className="cursor-pointer group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-300 shadow-inner transition-transform duration-500 group-hover:scale-110 mx-auto">
                  <Sparkles className="w-12 h-12 text-amber-700" />
                </div>
                <h3 className="text-2xl font-bold mt-6 mb-3 text-slate-900">
                  No Hassles
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  No couriers or online payments. Meet in person, exchange
                  instantly, and enjoy peace of mind.
                </p>
              </div>
              {/*  Card 4*/}
               <div className="cursor-pointer group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-indigo-300 shadow-inner transition-transform duration-500 group-hover:scale-110 mx-auto">
                  <Target className="w-12 h-12 text-indigo-700" />
                </div>
                <h3 className="text-2xl font-bold mt-6 mb-3 text-slate-900">
                 Personalised Recommendations
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Get personalized item suggestions based on what students in your hostel are looking for
                   — save time and find what you need faster.
                </p>
              </div>

            </div>
          </div>

          {/* Floating animation keyframes */}
          <style>
            {`
      @keyframes animate-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes animate-float-reverse {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(20px); }
      }
      .animate-float { animation: animate-float 6s ease-in-out infinite; }
      .animate-float-reverse { animation: animate-float-reverse 6s ease-in-out infinite; }
    `}
          </style>
        </section>

        <section className="relative overflow-hidden py-28 bg-gradient-hero">
          {/* Decorative Floating Circles */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-amber-400/20 filter blur-3xl animate-animate-float" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-amber-500/20 filter blur-3xl animate-animate-float-reverse" />

          {/* Animated Particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-300 rounded-full opacity-40 animate-float-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}

          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 animate-fadeUp">
                Ready to Start Trading?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 animate-fadeUp animate-delay-100">
                Join your hostel community on Fretio. Connect, buy, sell, and
                rent — all within your hostel.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeUp animate-delay-200">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl hover:from-amber-500 hover:to-amber-700 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-400 text-amber-600 hover:bg-amber-100 hover:text-amber-700 shadow-md transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/marketplace")}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle Glow & Wave Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_85%)]" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-wave-gradient opacity-40 pointer-events-none" />

          <style>
            {`
      @keyframes animate-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes animate-float-reverse {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(20px); }
      }
      @keyframes animate-float-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes fadeUp { 
        from { opacity: 0; transform: translateY(12px);} 
        to { opacity: 1; transform: translateY(0); } 
      }
      .animate-float { animation: animate-float 6s ease-in-out infinite; }
      .animate-float-reverse { animation: animate-float-reverse 7s ease-in-out infinite; }
      .animate-float-slow { animation: animate-float-slow infinite ease-in-out; }
      .animate-fadeUp { animation: fadeUp 0.8s ease-out forwards; }
      .animate-delay-100 { animation-delay: 0.1s; }
      .animate-delay-200 { animation-delay: 0.2s; }

      /* Wave Gradient at Bottom */
      .bg-wave-gradient {
        background: linear-gradient(180deg, rgba(255,203,60,0.2) 0%, rgba(255,203,60,0) 100%);
        clip-path: polygon(0 0, 100% 0, 100% 70%, 0% 100%);
      }
    `}
          </style>
        </section>
      </main>
    </div>
  );
};

export default Index;
