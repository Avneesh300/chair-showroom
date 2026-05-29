"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/lib/data";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const banner = banners[current];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${banner.bg} transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="max-w-xl">
            <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-widest">
              SRS Chair Showroom
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {banner.title}
            </h1>
            <p className="text-white/85 text-lg sm:text-xl mb-8">
              {banner.subtitle}
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-white text-amber-800 font-semibold px-7 py-3 rounded-full hover:bg-amber-50 transition-colors shadow-lg"
              >
                {banner.cta}
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Decorative chair icon */}
          <div className="hidden lg:flex items-center justify-center w-72 h-72">
            <div className="text-[160px] opacity-20 select-none">🪑</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/40 w-2"}`}
          />
        ))}
      </div>
    </div>
  );
}
