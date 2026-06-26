import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandsSection from "@/components/home/BrandsSection";
import { products } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const newArrivals = products.slice(-4);

  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandsSection />

        {/* New Arrivals */}
        <section className="py-12 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-amber-950 mb-1">New Arrivals</h2>
                <p className="text-gray-500 text-sm">Latest additions to our collection</p>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900">
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">Use Code: CHAIR10</h3>
                <p className="text-amber-200 text-sm sm:text-base">Get 10% off on your first order. Minimum order Rs. 5,000.</p>
              </div>
              <Link href="/products" className="bg-white text-amber-800 font-bold px-8 py-3.5 rounded-full hover:bg-amber-50 transition-colors text-sm whitespace-nowrap shadow-lg">
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
