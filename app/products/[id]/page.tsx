"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { products, reviews } from "@/lib/data";
import { formatPrice, getDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart, Heart, Star, Share2, ChevronRight,
  Shield, Truck, RotateCcw, CheckCircle, Minus, Plus
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Product not found</h2>
            <Link href="/products" className="text-amber-700 hover:underline">← Back to Products</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const discount = getDiscount(product.mrp, product.sellingPrice);
  const productReviews = reviews.filter((r) => r.productId === id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const specs = [
    { label: "Brand / Company", value: product.brand },
    { label: "Material", value: product.material },
    { label: "Frame Material", value: product.frameMaterial },
    { label: "Seat Height (adjustable)", value: product.seatHeight },
    { label: "Weight Capacity", value: product.weightCapacity },
    { label: "Armrest", value: product.armrest },
    { label: "Headrest", value: product.headrest },
    { label: "Recline Feature", value: product.recline },
    { label: "Warranty", value: product.warranty },
    { label: "Assembly Required", value: product.assemblyRequired ? "Yes" : "No" },
    { label: "Dimensions (L x W x H)", value: product.dimensions },
    { label: "Weight", value: product.weight },
    { label: "SKU", value: product.sku },
    { label: "GST", value: `${product.gstPercent}%` },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-700">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-amber-700">Chairs</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* Images */}
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden h-96 mb-3">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-amber-500" : "border-gray-200"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="text-sm text-amber-700 font-medium mb-1">{product.brand}</div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-100">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                    <span className="text-green-600 font-semibold text-sm">Save {formatPrice(product.mrp - product.sellingPrice)}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-4">*Price includes {product.gstPercent}% GST</p>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-5">
                {product.stockQty > 5 ? (
                  <span className="flex items-center gap-1.5 text-green-700 text-sm font-medium">
                    <CheckCircle size={15} /> In Stock ({product.stockQty} units)
                  </span>
                ) : product.stockQty > 0 ? (
                  <span className="text-orange-600 text-sm font-medium">⚠️ Only {product.stockQty} left!</span>
                ) : (
                  <span className="text-red-500 text-sm font-medium">❌ Out of Stock</span>
                )}
              </div>

              {/* Color */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-normal text-gray-500">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-sm rounded-full border-2 transition-colors ${selectedColor === color ? "border-amber-600 bg-amber-50 text-amber-800 font-medium" : "border-gray-200 text-gray-600 hover:border-amber-300"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm font-semibold text-gray-700">Quantity:</p>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 border border-gray-200 rounded-l-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 h-9 border-y border-gray-200 flex items-center justify-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                    className="w-9 h-9 border border-gray-200 rounded-r-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => addToCart(product, selectedColor, quantity)}
                  disabled={product.stockQty === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-colors ${isInWishlist(product.id) ? "bg-red-50 border-red-300 text-red-500" : "border-gray-200 text-gray-500 hover:border-amber-400"}`}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
                <button className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-amber-400 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-amber-50 rounded-2xl text-center">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "Above ₹5,000" },
                  { icon: Shield, label: product.warranty, sub: "Warranty" },
                  { icon: RotateCcw, label: "7-Day Return", sub: "Easy Return" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon size={18} className="text-amber-700" />
                    <span className="text-xs font-semibold text-gray-800">{label}</span>
                    <span className="text-xs text-gray-500">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-0">
              {(["desc", "specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? "border-amber-600 text-amber-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                  {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${productReviews.length})`}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "desc" && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {product.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-500" /> {tag.charAt(0).toUpperCase() + tag.slice(1)} design
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-amber-50" : "bg-white"}>
                      <td className="px-4 py-3 font-medium text-gray-700 w-48">{spec.label}</td>
                      <td className="px-4 py-3 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-4">
              {productReviews.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No reviews yet. Be the first to review!</p>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{review.customerName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString("en-IN")}</span>
                    </div>
                    {review.isVerified && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1 mb-2">
                        <CheckCircle size={11} /> Verified Purchase
                      </span>
                    )}
                    <p className="text-sm text-gray-600">{review.reviewText}</p>
                    <p className="text-xs text-gray-400 mt-2">{review.helpful} people found this helpful</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="font-serif text-2xl font-bold text-amber-950 mb-6">Related Chairs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
