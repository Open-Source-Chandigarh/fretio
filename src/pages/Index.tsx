import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    title: "Engineering Mechanics Textbook - R.S. Khurmi",
    price: 450,
    condition: "like-new" as const,
    images: ["/placeholder.svg"],
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
    images: ["/placeholder.svg"],
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
    images: ["/placeholder.svg"],
    seller: { name: "Rahul M", room: "C-89", rating: 4.7 },
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
    seller: { name: "Neha D", room: "A-67", rating: 5.0 },
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
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
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
              <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                Why Choose Fretio?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
                Built specifically for hostel communities to foster trust,
                safety, and simplicity.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-12">
              {/* Card 1 */}
              <div className="group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
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
              <div className="group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
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
              <div className="group relative bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
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
