"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/common/Pagination";
import { getProductsApi } from "@/services/product.service";
import { getCategoriesApi } from "@/services/category.service";
import { getBrandsApi } from "@/services/brand.service";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch categories & brands once
  useEffect(() => {
    const fetchDropdowns = async () => {
      const [catRes, brandRes]: any[] = await Promise.all([
        getCategoriesApi({ page: 1, limit: 100, search: "" }),
        getBrandsApi({ page: 1, limit: 100, search: "" }),
      ]);
      if (catRes?.success) setCategories(catRes.data);
      if (brandRes?.success) setBrands(brandRes.data);
    };
    fetchDropdowns();
  }, []);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    const response: any = await getProductsApi({
      page,
      limit: 12,
      search: "",
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      sort: sortBy,
      minPrice: priceRange[0],   // ✅ add karo
      maxPrice: priceRange[1],   // ✅ add karo
    });
    if (response?.success) {
      setProducts(response.data);
      const pagination = response.data?.[0]?.paginations;
      setTotalPages(pagination?.totalPages || 1);
      setTotalCount(pagination?.total || response.data.length);
      setCurrentPage(pagination?.currentPage || page);
    }
    setLoading(false);
  }, [selectedCategory, selectedBrand, sortBy, priceRange]);

  // Refetch when filters change
 useEffect(() => {
  setCurrentPage(1);
  fetchProducts(1);
}, [selectedCategory, selectedBrand, sortBy, priceRange]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSortBy("newest");
    setPriceRange([0, 50000]); // ✅ add karo
  };

  const activeFilters = [selectedCategory, selectedBrand].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || "All Chairs"
                : "All Chairs"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{totalCount} products found</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filter Bar */}
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

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 px-4 pr-8 py-2 rounded-full text-sm font-medium cursor-pointer hover:border-amber-400 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Active filter chips */}
            {selectedCategory && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("")}><X size={12} /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {brands.find((b) => b.id === selectedBrand)?.brand_name}
                <button onClick={() => setSelectedBrand("")}><X size={12} /></button>
              </span>
            )}
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
            )}
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filter */}
            {filterOpen && (
              <aside className="w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
                  <h3 className="font-semibold text-sm text-gray-800 mb-4">Category</h3>
                  <div className="space-y-2 mb-6">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <h3 className="font-semibold text-sm text-gray-800 mb-4">Brand</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedBrand("")}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedBrand ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      All Brands
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedBrand === brand.id ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {brand.brand_name}
                      </button>
                    ))}
                  </div>
                   <h3 className="font-semibold text-sm text-gray-800 mb-3 mt-6">
                  Max Price: ₹{priceRange[1].toLocaleString("en-IN")}
                </h3>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span>
                  <span>₹50,000</span>
                </div>
                </div>
               
              </aside>
            )}



            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🪑</div>
                  <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No chairs found</h3>
                  <button onClick={clearFilters} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 mt-4">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 bg-white rounded-2xl border border-gray-100">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={(page) => {
                          fetchProducts(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}