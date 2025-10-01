import { Button } from "@/components/ui/button";
import { Search, Users, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Hostel's
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Marketplace
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Buy, sell, and rent items within your hostel community. 
                Connect with fellow students, share resources, and build trust through verified student connections.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={() => window.location.href = '/marketplace'}
              >
                <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Browse Products
              </Button>
              <Button variant="accent" size="lg">
                Start Selling
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm font-medium">Community</div>
                <div className="text-xs text-muted-foreground">Hostel Only</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div className="text-sm font-medium">Verified</div>
                <div className="text-xs text-muted-foreground">Student IDs</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <div className="text-sm font-medium">Instant</div>
                <div className="text-xs text-muted-foreground">Face-to-Face</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-fretio-xl">
              <img 
                src={heroImage}
                alt="Students sharing and trading items in hostel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-card border rounded-lg shadow-fretio-lg p-4 max-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">A+</span>
                </div>
                <div>
                  <div className="text-xs font-semibold">Sarah M.</div>
                  <div className="text-xs text-muted-foreground">Room 204</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                "Found exactly what I needed for my studies!"
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card border rounded-lg shadow-fretio-lg p-4 max-w-[180px]">
              <div className="text-xs font-semibold mb-1">📚 Textbook</div>
              <div className="text-sm font-bold text-success">₹350</div>
              <div className="text-xs text-muted-foreground">Hostel A • 2m ago</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;