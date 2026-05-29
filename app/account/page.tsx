"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { orders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Package, User, MapPin, Heart, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const statusColors: Record<string, string> = {
  "Delivered": "bg-green-100 text-green-700",
  "Shipped": "bg-blue-100 text-blue-700",
  "Processing": "bg-amber-100 text-amber-700",
  "Order Placed": "bg-gray-100 text-gray-700",
  "Cancelled": "bg-red-100 text-red-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">👤</div>
            <div className="flex-1">
              <h1 className="font-serif text-xl font-bold text-gray-900">{user?.name || "Rahul Sharma"}</h1>
              <p className="text-sm text-gray-500">{user?.email || "rahul@example.com"}  •  9876543210</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium border border-red-100 hover:border-red-300 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: "My Orders", href: "/account/orders", count: orders.length },
              { icon: Heart, label: "Wishlist", href: "/wishlist", count: 0 },
              { icon: MapPin, label: "Addresses", href: "#", count: 2 },
              { icon: User, label: "Profile", href: "#", count: null },
            ].map(({ icon: Icon, label, href, count }) => (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-amber-300 hover:shadow-sm transition-all text-center group"
              >
                <Icon size={24} className="mx-auto mb-2 text-amber-600 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-800">{label}</div>
                {count !== null && <div className="text-xs text-gray-400 mt-0.5">{count} items</div>}
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <h2 className="font-serif text-xl font-bold text-amber-950 mb-4">My Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-50">
                  <div>
                    <span className="text-xs text-gray-400">Order ID</span>
                    <div className="font-semibold text-sm text-gray-800">{order.id}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Date</span>
                    <div className="text-sm text-gray-700">{new Date(order.date).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Total</span>
                    <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-amber-700 text-sm font-medium hover:text-amber-900">
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</div>
                        <div className="text-xs text-gray-400">
                          {item.selectedColor} • Qty: {item.quantity} • {formatPrice(item.product.sellingPrice)}
                        </div>
                      </div>
                      {order.status === "Delivered" && (
                        <button className="text-xs border border-amber-400 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50">
                          Write Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4 flex gap-3">
                  {order.status === "Processing" && (
                    <button className="text-xs border border-red-300 text-red-600 px-4 py-2 rounded-full hover:bg-red-50">
                      Cancel Order
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <button className="text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50">
                      Return Item
                    </button>
                  )}
                  <button className="text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50">
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
