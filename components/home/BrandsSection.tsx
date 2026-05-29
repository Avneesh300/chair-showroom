import { brands } from "@/lib/data";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export default function BrandsSection() {
  return (
    <>
      {/* Brands */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-6 font-medium">
            Trusted Brands Available
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {brands.map((brand) => (
              <div
                key={brand}
                className="text-sm font-bold text-gray-400 hover:text-amber-700 transition-colors cursor-pointer tracking-wide"
              >
                {brand.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 bg-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders above ₹5,000" },
              { icon: ShieldCheck, title: "Genuine Products", desc: "100% authentic brands" },
              { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-amber-300">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
