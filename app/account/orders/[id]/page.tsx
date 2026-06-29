"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getOrderDetailApi } from "@/services/order.service";
import { Loader2, ArrowLeft, Package } from "lucide-react";

interface AuthUser {
  full_name?: string;
  name?: string;
  email?: string;
  mobile?: string;
}

const statusColors: Record<string, string> = {
  "PLACED": "bg-gray-100 text-gray-700",
  "PROCESSING": "bg-amber-100 text-amber-700",
  "SHIPPED": "bg-blue-100 text-blue-700",
  "DELIVERED": "bg-green-100 text-green-700",
  "CANCELLED": "bg-red-100 text-red-700",
};

const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  useEffect(() => {
    const fetchOrder = async () => {
      const response: any = await getOrderDetailApi({ id });
      if (response?.success) setOrder(response.data);
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-600" />
      </div>
      <Footer />
    </>
  );

  if (!order) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Order not found</div>
      <Footer />
    </>
  );

  const currentStep = steps.indexOf(order.orderStatus);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link href="/account" className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 mb-6 font-medium">
            <ArrowLeft size={16} /> Back to Account
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-amber-950">Order Details</h1>
              <p className="text-sm text-gray-400 mt-0.5">#{String(order.id).slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Order Progress */}
          {order.orderStatus !== "CANCELLED" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
              <h2 className="font-semibold text-gray-800 mb-5 text-sm">Order Progress</h2>
              <div className="flex items-center">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= currentStep ? "bg-amber-700 border-amber-700 text-white" : "border-gray-300 text-gray-400"}`}>
                        {i <= currentStep ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${i <= currentStep ? "text-amber-700" : "text-gray-400"}`}>
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < currentStep ? "bg-amber-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">

              {/* Items */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-4 text-sm">Items Ordered</h2>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      {item.productImage
                        ? <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        : <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">🪑</div>
                      }                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{item.productName}</div>
                        <div className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-3 text-sm">Delivery Address</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">{order.full_name}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.state} — {order.pincode}</p>
                  <p>📞 {order.mobile}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-4 text-sm">Price Details</h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- {formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={order.shippingCharge === 0 ? "text-green-600" : ""}>
                      {order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-3 text-sm">Payment</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === "SUCCESS" ? "bg-green-100 text-green-700" : order.paymentStatus === "FAILED" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}