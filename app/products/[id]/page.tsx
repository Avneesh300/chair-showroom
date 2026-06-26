"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { getProductDetailApi, getProductsApi } from "@/services/product.service";
import {
  ShoppingCart, Heart, Star, Share2, ChevronRight,
  Shield, Truck, RotateCcw, CheckCircle, Minus, Plus, Loader2
} from "lucide-react";
import { getProductReviewsApi, deleteReviewApi } from "@/services/review.service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const decodedId = decodeURIComponent(id);
      const isObjectId = /^[a-f\d]{24}$/i.test(decodedId);

      const payload = isObjectId
        ? { id: decodedId }
        : { slug: decodedId };

      const response: any = await getProductDetailApi(payload);

      if (response?.success) {
        setProduct(response.data);
        if (response.data?.category?.id) {
          const relatedRes: any = await getProductsApi({
            page: 1,
            limit: 5,
            search: "",
            category: response.data.category.id,
          });
          if (relatedRes?.success) {
            setRelated(
              relatedRes.data
                .filter((p: any) => p.id !== response.data.id)
                .slice(0, 4)
            );
          }
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);


  const fetchReviews = async () => {
    if (!product?.id) return;
    setReviewsLoading(true);
    const response: any = await getProductReviewsApi({ productId: product.id, page: 1, limit: 20 });
    if (response?.success) {
      setReviews(response.data.reviews);
      setReviewStats({
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
      });
    }
    setReviewsLoading(false);
  };

  const handleShare = async () => {
  const shareData = {
    title: product.product_name,
    text: product.description || product.product_name,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    }
  } catch (error) {
    console.log("Share cancelled", error);
  }
};


  useEffect(() => {
    if (activeTab === "reviews" && product?.id) {
      fetchReviews();
    }
  }, [activeTab, product]);


  const handleDeleteReview = async (reviewId: string) => {

    setDeletingReviewId(reviewId);
    const response: any = await deleteReviewApi({ id: reviewId, status: "A" });
    if (response?.success) {
      toast.success("Review deleted");
      fetchReviews();
    } else {
      toast.error(response?.message || "Failed to delete");
    }
    setDeletingReviewId(null);
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-600" />
      </div>
      <Footer />
    </>
  );

  if (!product) return (
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

  const mrp = Number(product.mrp) || 0;
  const sellingPrice = Number(product.sellingPrice) || 0;
  const discount = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const stock = Number(product.stock) || 0;

  const specs = [
    { label: "Brand", value: product.brand?.brand_name },
    { label: "Category", value: product.category?.category_name },
    { label: "Material", value: product.material },
    { label: "Frame Material", value: product.frameMaterial },
    { label: "Seat Height", value: product.seatHeight },
    { label: "Weight Capacity", value: product.weightCapacity },
    { label: "Armrest", value: product.armrest },
    { label: "Headrest", value: product.headrest },
    { label: "Recline", value: product.recline },
    { label: "Warranty", value: product.warranty },
    { label: "Dimensions", value: product.dimensions },
    { label: "SKU", value: product.sku },
    { label: "Color", value: product.color_name },
  ].filter(s => s.value);

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
            <span className="text-gray-800 font-medium line-clamp-1">{product.product_name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

            {/* Image */}
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden h-96 mb-3">
                {product.product_image
                  ? <img src={product.product_image} alt={product.product_name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-8xl">🪑</div>
                }
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="text-sm text-amber-700 font-medium mb-1">{product.brand?.brand_name}</div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product.product_name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-100">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(sellingPrice)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(mrp)}</span>
                    <span className="text-green-600 font-semibold text-sm">Save {formatPrice(mrp - sellingPrice)}</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-5">
                {stock > 5 ? (
                  <span className="flex items-center gap-1.5 text-green-700 text-sm font-medium">
                    <CheckCircle size={15} /> In Stock ({stock} units)
                  </span>
                ) : stock > 0 ? (
                  <span className="text-orange-600 text-sm font-medium">⚠️ Only {stock} left!</span>
                ) : (
                  <span className="text-red-500 text-sm font-medium">❌ Out of Stock</span>
                )}
              </div>

              {/* Color */}
              {product.color_name && (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Color: <span className="font-normal text-gray-500">{product.color_name}</span>
                  </p>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-amber-500"
                      style={{ backgroundColor: product.color_code || "#ccc" }}
                    />
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm font-semibold text-gray-700">Quantity:</p>
                <div className="flex items-center">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 border border-gray-200 rounded-l-full flex items-center justify-center hover:bg-gray-50">
                    <Minus size={14} />
                  </button>
                  <span className="w-12 h-9 border-y border-gray-200 flex items-center justify-center text-sm font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="w-9 h-9 border border-gray-200 rounded-r-full flex items-center justify-center hover:bg-gray-50">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => addToCart(product, product.color_name, quantity)}
                  disabled={stock === 0}
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
                <button
                  onClick={handleShare}
                  className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-amber-400"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-amber-50 rounded-2xl text-center">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "Above ₹5,000" },
                  { icon: Shield, label: product.warranty || "Warranty", sub: "Warranty" },
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
                  {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${reviewStats.totalReviews})`}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "desc" && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed text-sm">{product.description || "No description available."}</p>
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
            <div className="max-w-2xl space-y-5">


              {/* ✅ Reviews List */}
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-amber-600" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{review.userName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-IN")}
                        </span>
                        {user && String(review.userId) === String(user._id) && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deletingReviewId === review.id}
                            className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-0.5 rounded-lg disabled:opacity-60"
                          >
                            {deletingReviewId === review.id ? <Loader2 size={10} className="animate-spin inline" /> : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.review}</p>
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
                {related.map((p: any) => (
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