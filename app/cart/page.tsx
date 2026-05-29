"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { coupons } from "@/lib/data";
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [couponError, setCouponError] = useState("");

  const applyCoupon = () => {
    const found = coupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!found) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    if (cartTotal < found.minOrderValue) {
      setCouponError(`Minimum order ₹${found.minOrderValue.toLocaleString("en-IN")} required`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
    setCouponError("");
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((cartTotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const shippingCharge = cartTotal >= 5000 ? 0 : 299;
  const finalTotal = cartTotal - discountAmount + shippingCharge;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">
            Shopping Cart
            {cartItems.length > 0 && <span className="text-gray-400 font-normal text-lg ml-2">({cartItems.length} items)</span>}
          </h1>

          {cartItems.length === 0 ? (
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
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4">
                    <Link href={`/products/${item.product.id}`}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-amber-700 font-medium">{item.product.brand}</div>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-amber-800">{item.product.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">Color: {item.selectedColor}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 border border-gray-200 rounded-l flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-9 h-7 border-y border-gray-200 flex items-center justify-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 border border-gray-200 rounded-r flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.product.sellingPrice * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-amber-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-green-600 text-xs mt-2 font-medium">
                      ✅ Coupon applied! You saved {formatPrice(discountAmount)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Try: CHAIR10, SAVE500, NEWUSER</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-20">
                  <h3 className="font-semibold text-gray-800 mb-5">Order Summary</h3>
                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>- {formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shippingCharge === 0 ? "text-green-600" : ""}>
                        {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                      </span>
                    </div>
                    {cartTotal < 5000 && (
                      <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                        Add {formatPrice(5000 - cartTotal)} more for free delivery!
                      </p>
                    )}
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
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
