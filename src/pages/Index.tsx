import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
      rating: 4.8
    },
    category: "Books",
    timeAgo: "2h ago",
    views: 23,
    isForRent: false
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
      rating: 4.9
    },
    category: "Electronics",
    timeAgo: "5h ago",
    views: 67,
    isForRent: true,
    rentPricePerDay: 500
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
      rating: 4.7
    },
    category: "Furniture",
    timeAgo: "1d ago",
    views: 45,
    isForRent: false
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
      rating: 5.0
    },
    category: "Hobbies",
    timeAgo: "3d ago",
    views: 89,
    isForRent: true,
    rentPricePerDay: 150
  }
];

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users based on their profile status
      if (!profile?.university_id || !profile?.hostel_id) {
        navigate('/complete-profile');
      } else if (profile.verification_status === 'verified') {
        navigate('/marketplace');
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
        
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground">Fresh listings from your hostel community</p>
              </div>
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Fretio?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for hostel communities to foster trust and convenience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Hostel Community</h3>
                <p className="text-muted-foreground">
                  Connect only with students from your hostel. Build trust within your immediate community.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Verified Students</h3>
                <p className="text-muted-foreground">
                  All users verify their student status. Trade safely with verified hostel mates.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
                  <Sparkles className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold">No Hassles</h3>
                <p className="text-muted-foreground">
                  No delivery, no online payments. Meet face-to-face and exchange within your hostel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Start Trading?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Join your hostel community on Fretio. Connect with your hostel mates and start buying, selling, and renting items safely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-foreground/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
