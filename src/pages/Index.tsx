import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import { px } from "framer-motion";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    title: "Engineering Mechanics Textbook - R.S. Khurmi",
    price: 450,
    condition: "like-new" as const,
    images: ["/placeholder.svg"],
    seller: {
      name: "Arjun K",
      room: "A-204",
      rating: 4.8,
    },
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
    images: ["/placeholder.svg"],
    seller: {
      name: "Priya S",
      room: "B-156",
      rating: 4.9,
    },
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
    images: ["/placeholder.svg"],
    seller: {
      name: "Rahul M",
      room: "C-89",
      rating: 4.7,
    },
    category: "Furniture",
    timeAgo: "1d ago",
    views: 45,
    isForRent: false,
  },
  {
    id: "4",
    title: "Guitar - Yamaha F310 Acoustic",
    price: 8500,
    condition: "good" as const,
    images: ["/placeholder.svg"],
    seller: {
      name: "Neha D",
      room: "A-67",
      rating: 5.0,
    },
    category: "Hobbies",
    timeAgo: "3d ago",
    views: 89,
    isForRent: true,
    rentPricePerDay: 150,
  },
];

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users based on their profile status
      if (!profile?.university_id || !profile?.hostel_id) {
        navigate("/complete-profile");
      } else if (profile.verification_status === "verified") {
        navigate("/marketplace");
      }
    }
  }, [user, profile, loading, navigate]);

  // Show loading or redirect for authenticated users
  if (loading || (user && profile)) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoryGrid />

        <section className="py-20 bg-gradient-to-b from-white to-blue-50/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-indigo-400 bg-clip-text text-transparent">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Discover what’s trending in your hostel community
                </p>
              </div>
              <Button
                variant="outline"
                className="hidden md:flex border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/20 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(251,191,36,0.08),transparent_70%)]" />

          <div className="container relative mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Why Choose Fretio?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Built specifically for hostel communities to foster trust,
                safety, and simplicity.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Card 1 */}
              <div className="group relative bg-card border border-border/60 rounded-2xl p-8 text-center shadow-fretio-sm hover:shadow-fretio-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Hostel Community
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect exclusively with students from your hostel. Build
                  trust and familiarity where it matters most.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card 2 */}
              <div className="group relative bg-card border border-border/60 rounded-2xl p-8 text-center shadow-fretio-sm hover:shadow-fretio-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 shadow-inner group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Verified Students
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every member verifies their student ID, ensuring trades are
                  safe, authentic, and within your hostel network.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Card 3 */}
              <div className="group relative bg-card border border-border/60 rounded-2xl p-8 text-center shadow-fretio-sm hover:shadow-fretio-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-success/10 shadow-inner group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Sparkles className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-xl font-semibold mt-6 mb-3">No Hassles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No couriers or online payments. Meet in person, exchange
                  instantly, and enjoy peace of mind.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-success opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 bg-gradient-hero">
          {/* Decorative Floating Circles */}
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-amber-400/20 filter blur-3xl animate-animate-float" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-amber-500/20 filter blur-3xl animate-animate-float-reverse" />

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
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg hover:from-amber-500 hover:to-amber-700 transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-400 text-amber-600 hover:bg-amber-100 hover:text-amber-700 shadow-sm transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate("/marketplace")}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_80%)]" />
        </section>
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

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: translateY(0); } }
  .animate-fadeUp { animation: fadeUp 0.8s ease-out forwards; }
  .animate-delay-100 { animation-delay: 0.1s; }
  .animate-delay-200 { animation-delay: 0.2s; }`}
        </style>
      </main>
    </div>
  );
};

export default Index;
