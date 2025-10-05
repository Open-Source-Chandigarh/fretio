"use client";

import { Button } from "@/components/ui/button";
import { Search, Users, ShieldCheck, Zap, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TypeLine = ({ words }: { words: string[] }) => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState<"f" | "b">("f");
  useEffect(() => {
    const full = words[i % words.length];
    const t = setTimeout(() => {
      if (dir === "f" && text.length < full.length) setText(full.slice(0, text.length + 1));
      else if (dir === "f") setDir("b");
      else if (dir === "b" && text.length > 0) setText(full.slice(0, text.length - 1));
      else {
        setDir("f");
        setI(i + 1);
      }
    }, dir === "f" ? 60 : 40);
    return () => clearTimeout(t);
  }, [text, dir, i, words]);
  return (
    <span className="text-teal-500 font-medium">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      {/* Ambient background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-teal-100 via-transparent to-transparent blur-3xl opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-rose-100 via-transparent to-transparent blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs text-amber-900 ring-1 ring-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>Built for hostel communities</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900">
                Your Hostel’s{" "}
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Marketplace
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                Buy, sell, and rent items with verified students — fast, friendly, and secure.{" "}
                <br />
                <TypeLine
                  words={[
                    "Smart & Secure",
                    "Community Driven",
                    "Built for Students",
                  ]}
                />
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="hero"
                size="lg"
                className="group relative overflow-hidden bg-gradient-hero text-white shadow-lg hover:shadow-xl transition-all"
                onClick={() => (window.location.href = "/marketplace")}
              >
                <Search className="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform" />
                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-amber-500 text-hero hover:bg-amber-50"
                onClick={() => (window.location.href = "/auth")}
              >
                Start Selling
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-10 text-center">
              <div className="rounded-xl p-4 hover:bg-slate-50 transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-3">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div className="font-semibold text-slate-800">Community</div>
                <div className="text-xs text-slate-500">Hostel Only</div>
              </div>
              <div className="rounded-xl p-4 hover:bg-slate-50 transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="font-semibold text-slate-800">Verified</div>
                <div className="text-xs text-slate-500">Student IDs</div>
              </div>
              <div className="rounded-xl p-4 hover:bg-slate-50 transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-3">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div className="font-semibold text-slate-800">Instant</div>
                <div className="text-xs text-slate-500">Face-to-Face</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE IMAGE + FLOATING CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img
                src={heroImage}
                alt="Students trading in hostel"
                className="w-full h-full object-cover rounded-[2rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-8 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-4 w-48"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-xs">
                  A+
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Sarah M.</div>
                  <div className="text-xs text-slate-500">Room 204</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                “Found exactly what I needed for my studies!”
              </p>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-6 -left-8 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-4 w-44"
            >
              <div className="text-xs font-semibold mb-1 text-slate-700 flex items-center gap-1">
                <span className="text-lg text-amber-500">📚</span> Textbook
              </div>
              <div className="text-sm font-bold text-emerald-600">₹350</div>
              <div className="text-xs text-slate-500 mt-1">Hostel A • 2m ago</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
