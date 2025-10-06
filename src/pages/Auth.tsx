import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  Home,
  Coffee,
  MapPin,
  Key,
  BookOpen,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

// Hostel-themed icons
const hostelIcons = [
  Home, Coffee, MapPin, Key, BookOpen, MessageCircle, Briefcase
];

const blobs = [
  { color: "bg-yellow-200/40", x: 0, y: 0, size: 80, speed: 20 },
  { color: "bg-amber-200/30", x: 250, y: 150, size: 120, speed: 25 },
  { color: "bg-orange-200/30", x: 150, y: 300, size: 90, speed: 18 },
];

const generateIcons = (count: number) => {
  return Array.from({ length: count }).map(() => {
    const Icon = hostelIcons[Math.floor(Math.random() * hostelIcons.length)];
    return {
      Icon,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 10 + Math.random() * 15,
      size: 20 + Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.4,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    };
  });
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [floatingIcons, setFloatingIcons] = useState(generateIcons(20));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) navigate("/");
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
      await signUp(formData.email, formData.password, formData.fullName);
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Mouse movement effect for interactive floating
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate icons
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingIcons((icons) =>
        icons.map((icon) => {
          const nx = icon.x + icon.dx + (mousePos.x - icon.x) * 0.0005;
          const ny = icon.y + icon.dy + (mousePos.y - icon.y) * 0.0005;

          if (nx > window.innerWidth || nx < 0) icon.dx *= -1;
          if (ny > window.innerHeight || ny < 0) icon.dy *= -1;

          return { ...icon, x: nx, y: ny };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50">
      
      {/* Blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.color}`}
          style={{ width: blob.size, height: blob.size, top: blob.y, left: blob.x }}
          animate={{
            x: [blob.x, blob.x + 30, blob.x - 30, blob.x],
            y: [blob.y, blob.y + 20, blob.y - 20, blob.y],
          }}
          transition={{ duration: blob.speed, repeat: Infinity, repeatType: "mirror" }}
        />
      ))}

      {/* Floating hostel icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-white/40"
          style={{
            top: icon.y,
            left: icon.x,
            fontSize: icon.size,
            opacity: icon.opacity,
          }}
        >
          <icon.Icon size={icon.size} />
        </motion.div>
      ))}

      {/* Back Button */}
      <div className="self-start m-4 z-10">
        <Button
          className="bg-gradient-to-r from-amber-300 to-yellow-400 text-white shadow-lg hover:from-amber-400 hover:to-yellow-500 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mt-12 shadow-xl rounded-3xl z-10 backdrop-blur-lg bg-white/60 border border-white/30"
      >
        <Card className="bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-700">Fretio</CardTitle>
            <CardDescription className="text-amber-900/70">
              {isLogin ? "Welcome back to your hostel marketplace" : "Join your hostel community"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-amber-200/50 p-1 mb-6 backdrop-blur-sm">
                <TabsTrigger value="login" className="text-amber-800 hover:bg-amber-300/50 transition-all">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-amber-800 hover:bg-amber-300/50 transition-all">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="email" className="text-amber-900">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                      />
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="password" className="text-amber-900">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                      />
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-amber-900" /> : <Eye className="h-4 w-4 text-amber-900" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="fullName" className="text-amber-900">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                        className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                      />
                      <User className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="signupEmail" className="text-amber-900">Email</Label>
                    <div className="relative">
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                      />
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="signupPassword" className="text-amber-900">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        minLength={6}
                        className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                      />
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-amber-900" /> : <Eye className="h-4 w-4 text-amber-900" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword" className="text-amber-900">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="pl-10 bg-white/50 placeholder-amber-700 text-amber-900 border-amber-300"
                    />
                    <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-amber-900/70 text-sm">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
