import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-amber-950 mb-1">Featured Chairs</h2>
            <p className="text-gray-500 text-sm">Our most popular and top-rated picks</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
