"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">
            My Wishlist
            {wishlistItems.length > 0 && (
              <span className="text-gray-400 font-normal text-lg ml-2">({wishlistItems.length} items)</span>
            )}
          </h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-24">
              <Heart size={64} className="mx-auto text-gray-200 mb-4" />
              <h2 className="font-serif text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 text-sm mb-6">Save chairs you love for later</p>
              <Link href="/products" className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors">
                Browse Chairs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
