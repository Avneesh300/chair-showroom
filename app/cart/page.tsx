"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { getCartApi, deleteCartApi, applyCouponApi } from "@/services/cart.service";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const fetchCart = async () => {
    setLoading(true);
    const response: any = await getCartApi({ page: 1, limit: 100 });
    if (response?.success) setCartItems(response.data);
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const handleDelete = async (id: string, status: string) => {
    const response: any = await deleteCartApi({ id, status });
    if (response?.success) {
      toast.success(response.message);
      fetchCart();
      // ✅ Coupon recalculate karo
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCode("");
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) { setCouponError("Please enter a coupon code"); return; }
    setCouponLoading(true);
    setCouponError("");
    const response: any = await applyCouponApi({
      couponCode,
      cartTotal: subtotal,
    });
    if (response?.success) {
      setAppliedCoupon(response);
      toast.success(response.message);
    } else {
      setCouponError(response?.message || "Invalid coupon");
      setAppliedCoupon(null);
    }
    setCouponLoading(false);
  };

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.sellingPrice) * (item.quantity || 1)), 0
  );
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount) : 0;
  const shippingCharge = subtotal >= 5000 ? 0 : 299;
  const finalTotal = subtotal - discountAmount + shippingCharge;
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="text-gray-400 font-normal text-lg ml-2">({cartItems.length} items)</span>
            )}
          </h1>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
              <h2 className="font-serif text-xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-400 text-sm mb-6">Add some chairs to get started</p>
              <Link href="/products" className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors">
                Browse Chairs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4">
                    <Link href={`/products/${item.slug || item.productId}`}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                        : <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">🪑</div>
                      }
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-amber-700 font-medium">{item.brand_name || ""}</div>
                      <Link href={`/products/${item.slug || item.productId}`}>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-amber-800">
                          {item.name}
                        </h3>
                      </Link>
                      {item.color_name && (
                        <p className="text-xs text-gray-500 mt-0.5">Color: {item.color_name}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-gray-900">
                          {formatPrice(Number(item.sellingPrice) * (item.quantity || 1))}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id, item.status == 1 ? "A" : "B")}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                    <Tag size={15} className="text-amber-600" /> Apply Coupon
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                        setAppliedCoupon(null);
                      }}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-800 disabled:opacity-60"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-green-600 text-xs mt-2 font-medium">
                      ✅ Coupon applied! You saved {formatPrice(discountAmount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-20">
                  <h3 className="font-semibold text-gray-800 mb-5">Order Summary</h3>
                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({appliedCoupon?.couponCode})</span>
                        <span>- {formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shippingCharge === 0 ? "text-green-600" : ""}>
                        {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                      </span>
                    </div>
                    {subtotal < 5000 && (
                      <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                        Add {formatPrice(5000 - subtotal)} more for free delivery!
                      </p>
                    )}
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/checkout?total=${finalTotal}&discount=${discountAmount}&coupon=${appliedCoupon?.couponCode || ""}`}
                    className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/products"
                    className="block text-center text-sm text-amber-700 hover:text-amber-900 mt-3 font-medium"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}