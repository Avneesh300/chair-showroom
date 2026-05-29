"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { products, categories, brands } from "@/lib/data";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    result = result.filter((p) => p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1]);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.sellingPrice - b.sellingPrice); break;
      case "price-high": result.sort((a, b) => b.sellingPrice - a.sellingPrice); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: result.sort((a, b) => parseInt(b.id.replace("p", "")) - parseInt(a.id.replace("p", "")));
    }
    return result;
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 50000]);
    setSortBy("newest");
  };

  const activeFilters = [selectedCategory, selectedBrand].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
              {selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name || "All Chairs" : "All Chairs"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} products found</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:border-amber-400 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters > 0 && (
                <span className="bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilters}</span>
              )}
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 px-4 pr-8 py-2 rounded-full text-sm font-medium cursor-pointer hover:border-amber-400 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {selectedCategory && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("")}><X size={12} /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("")}><X size={12} /></button>
              </span>
            )}
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
            )}
          </div>

          <div className="flex gap-6">
            {filterOpen && (
              <aside className="w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
                  <h3 className="font-semibold text-sm text-gray-800 mb-4">Category</h3>
                  <div className="space-y-2 mb-6">
                    <button onClick={() => setSelectedCategory("")} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>All Categories</button>
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.slug ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-4">Brand</h3>
                  <div className="space-y-2 mb-6">
                    <button onClick={() => setSelectedBrand("")} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedBrand ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>All Brands</button>
                    {brands.map((brand) => (
                      <button key={brand} onClick={() => setSelectedBrand(brand)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedBrand === brand ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                        {brand}
                      </button>
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-3">Max Price: ₹{priceRange[1].toLocaleString("en-IN")}</h3>
                  <input type="range" min={0} max={50000} step={1000} value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-amber-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹0</span><span>₹50,000</span></div>
                </div>
              </aside>
            )}

            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🪑</div>
                  <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No chairs found</h3>
                  <button onClick={clearFilters} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 mt-4">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
