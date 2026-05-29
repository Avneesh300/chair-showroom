"use client";

import { products, orders, categories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const weeklyRevenue = [
  { day: "Mon", amount: 45000 },
  { day: "Tue", amount: 62000 },
  { day: "Wed", amount: 38000 },
  { day: "Thu", amount: 75000 },
  { day: "Fri", amount: 91000 },
  { day: "Sat", amount: 110000 },
  { day: "Sun", amount: 67000 },
];

const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  "Order Placed": "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
};

const topSelling = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
const lowStock = products.filter((p) => p.stockQty <= 15);

export default function AdminDashboard() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    {
      label: "Today's Revenue",
      value: formatPrice(totalRevenue),
      change: "+12.5%",
      up: true,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      change: "+8.2%",
      up: true,
      icon: ShoppingBag,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "New Customers",
      value: "47",
      change: "+3.1%",
      up: true,
      icon: Users,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Low Stock Items",
      value: lowStock.length.toString(),
      change: "Needs attention",
      up: false,
      icon: Package,
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, bg, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={17} className={iconColor} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
              {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {change} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800">Weekly Revenue</h2>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">+18% this week</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weeklyRevenue.map(({ day, amount }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-amber-500 rounded-t-lg hover:bg-amber-600 transition-colors cursor-pointer relative group"
                    style={{ height: `${(amount / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(amount)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {categories.slice(0, 6).map((cat, i) => {
              const pct = Math.round(100 - i * 12);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{cat.icon} {cat.name}</span>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-amber-700 hover:text-amber-900 font-medium">View All →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{order.id}</div>
                  <div className="text-xs text-gray-400">{order.address.name} • {new Date(order.date).toLocaleDateString("en-IN")}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
                <div className="text-sm font-bold text-gray-900 ml-2">{formatPrice(order.total)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" /> Low Stock Alert
            </h2>
            <a href="/admin/products" className="text-xs text-amber-700 hover:text-amber-900 font-medium">Manage →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.map((p) => (
              <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.brand} • SKU: {p.sku}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stockQty <= 5 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                  {p.stockQty} left
                </span>
              </div>
            ))}
            {lowStock.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">All products are well stocked ✅</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Selling */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Top Selling Chairs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Product", "Brand", "Category", "Price", "Reviews", "Stock"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topSelling.map((p, i) => (
                <tr key={p.id} className="hover:bg-amber-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded-lg" />
                      <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{p.brand}</td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap capitalize">{p.category.replace("-", " ")}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{formatPrice(p.sellingPrice)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{p.reviewCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stockQty > 20 ? "bg-green-100 text-green-700" : p.stockQty > 5 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                      {p.stockQty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
