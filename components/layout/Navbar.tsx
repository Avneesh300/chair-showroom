"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/lib/data";

export default function Navbar() {
  const { cartCount, wishlistItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-amber-100">
      {/* Top bar */}
      <div className="bg-amber-800 text-amber-50 text-xs py-1.5 text-center">
        🚚 Free delivery on orders above ₹5,000 &nbsp;|&nbsp; COD Available &nbsp;|&nbsp; 📞 1800-XXX-XXXX
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-amber-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🪑</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-amber-900 text-lg leading-none">SRS Chairs</div>
              <div className="text-xs text-amber-600 tracking-widest">SHOWROOM</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm text-gray-700 hover:text-amber-700 font-medium transition-colors">
              Home
            </Link>
            {/* <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-amber-700 font-medium transition-colors">
                Categories <ChevronDown size={14} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-xl shadow-xl w-64 py-2 z-50">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="ml-auto text-xs text-gray-400">({cat.productCount})</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/products" className="block px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50">
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div> */}
            <Link href="/products" className="px-3 py-2 text-sm text-gray-700 hover:text-amber-700 font-medium transition-colors">
              All Chairs
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm text-gray-700 hover:text-amber-700 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm text-gray-700 hover:text-amber-700 font-medium transition-colors">
              Contact
            </Link>
          </nav>


          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              className="md:hidden p-2 text-gray-600 hover:text-amber-700"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>

            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-amber-700 transition-colors">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-amber-700 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/account" className="hidden sm:flex p-2 text-gray-600 hover:text-amber-700 transition-colors">
              <User size={20} />
            </Link>

            <button
              className="lg:hidden p-2 text-gray-600 hover:text-amber-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-amber-400">
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search chairs..."
                className="bg-transparent text-sm outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {[
            { label: "Home", href: "/" },
            { label: "All Chairs", href: "/products" },
            { label: "Office Chairs", href: "/products?category=office-chairs" },
            { label: "Gaming Chairs", href: "/products?category=gaming-chairs" },
            { label: "Recliner Chairs", href: "/products?category=recliner-chairs" },
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "My Account", href: "/account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
