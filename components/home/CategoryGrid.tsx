"use client";

import Link from "next/link";

interface Props {
  categories: any[];
  loading: boolean;
}

export default function CategoryGrid({ categories, loading }: Props) {
  return (
    <section className="py-12 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-amber-950 mb-2">Shop by Category</h2>
          <p className="text-gray-500 text-sm">Find the perfect chair for every room and purpose</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
              ))
            : categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="group bg-white rounded-2xl p-4 text-center hover:shadow-md hover:border-amber-300 border border-transparent transition-all duration-200 cursor-pointer"
                >
                  <div className="text-4xl mb-2.5 group-hover:scale-110 transition-transform duration-200">🪑</div>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-amber-800 leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400">{cat.productCount} items</p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}