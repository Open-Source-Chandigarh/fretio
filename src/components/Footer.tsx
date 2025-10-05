// components/Footer.tsx
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenRoutes = ["/auth"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-200 to-orange-100 text-gray-900">
      {/* Decorative Floating Circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-400/20 filter blur-3xl animate-float" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/20 filter blur-3xl animate-float-reverse" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Fretio</h3>
            <p className="text-sm text-gray-700">
              A safe marketplace for hostel communities. Buy, sell, and rent items within your hostel.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="hover:text-amber-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-amber-600 transition-colors"><Github size={20} /></a>
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-amber-600 transition-colors" onClick={() => navigate("/marketplace")}>Browse Products</button></li>
              <li><button className="hover:text-amber-600 transition-colors" onClick={() => navigate("/my-products")}>My Listings</button></li>
              <li><button className="hover:text-amber-600 transition-colors" onClick={() => navigate("/favorites")}>Favorites</button></li>
              <li><button className="hover:text-amber-600 transition-colors" onClick={() => navigate("/reviews")}>Reviews</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-amber-600 transition-colors">Help Center</button></li>
              <li><button className="hover:text-amber-600 transition-colors">Contact Us</button></li>
              <li><button className="hover:text-amber-600 transition-colors">Terms & Conditions</button></li>
              <li><button className="hover:text-amber-600 transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-700">Subscribe for the latest hostel listings and updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-300 text-white hover:from-amber-500 hover:to-orange-400 shadow-lg"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-12 pt-6 text-center text-sm text-gray-700">
          &copy; {new Date().getFullYear()} Fretio. All rights reserved.
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-reverse { animation: float-reverse 6s ease-in-out infinite; }
        `}
      </style>
    </footer>
  );
};

export default Footer;
