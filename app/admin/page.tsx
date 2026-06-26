"use client";

import { useState, useEffect } from "react";
import { getDashboardStatsApi } from "@/services/dashboard.service";
import {
  TrendingUp, ShoppingBag, Users, Package,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";

const statusColors: Record<string, string> = {
  PLACED: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  useEffect(() => {
    const fetch = async () => {
      const res: any = await getDashboardStatsApi();
      if (res?.success) setData(res.data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-amber-600" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-20 text-gray-400">Failed to load dashboard</div>
  );

  const { stats, weeklyRevenue, salesByCategory, recentOrders, lowStock, topSelling } = data;
  const maxRevenue = Math.max(...weeklyRevenue.map((d: any) => d.amount), 1);

  const statCards = [
    {
      label: "Today's Revenue",
      value: formatPrice(stats.todayRevenue),
      change: `${stats.todayRevenueChange} vs last week`,  // ✅ API se
      up: stats.todayRevenueUp,                             // ✅ API se
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      change: `${stats.totalOrdersChange} vs last week`,   // ✅ API se
      up: stats.totalOrdersUp,                              // ✅ API se
      icon: ShoppingBag,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "New Customers",
      value: stats.newCustomers.toString(),
      change: `${stats.newCustomersChange} vs last month`, // ✅ API se
      up: stats.newCustomersUp,                             // ✅ API se
      icon: Users,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      change: `${stats.lowStockChange} vs last week`,      // ✅ API se
      up: stats.lowStockUp,                                 // ✅ Always false
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

      {/* STEP 1 — Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, change, up, icon: Icon, bg, iconColor }) => (
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
              {change}
            </div>
          </div>
        ))}
      </div>

      {/* STEP 2 + 3 — Weekly Revenue + Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800">Weekly Revenue</h2>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
              {formatPrice(weeklyRevenue.reduce((s: number, d: any) => s + d.amount, 0))} this week
            </span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weeklyRevenue.map(({ day, amount }: any) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-amber-500 rounded-t-lg hover:bg-amber-600 transition-colors cursor-pointer relative group"
                    style={{ height: `${Math.max((amount / maxRevenue) * 100, amount > 0 ? 5 : 0)}%` }}
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

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Sales by Category</h2>
          {salesByCategory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {salesByCategory.map((cat: any) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className="font-semibold text-gray-800">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STEP 4 + 5 — Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-amber-700 hover:text-amber-900 font-medium">View All →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No orders yet</div>
            ) : recentOrders.map((order: any) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">
                    #{String(order.id).slice(-8).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {order.customerName} • {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                  {order.orderStatus}
                </span>
                <div className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" /> Low Stock Alert
            </h2>
            <a href="/admin/products" className="text-xs text-amber-700 hover:text-amber-900 font-medium">Manage →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">All products are well stocked ✅</div>
            ) : lowStock.map((p: any) => (
              <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                {p.product_image
                  ? <img src={p.product_image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  : <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xl">🪑</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{p.product_name}</div>
                  <div className="text-xs text-gray-400">{p.brand_name} • SKU: {p.sku}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock <= 5 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 6 — Top Selling */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Top Selling Chairs</h2>
        </div>
        {topSelling.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No sales data yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Product", "Brand", "Category", "Price", "Sold", "Stock"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topSelling.map((p: any, i: number) => (
                  <tr key={String(p.id)} className="hover:bg-amber-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {p.product_image
                          ? <img src={p.product_image} alt="" className="w-9 h-9 object-cover rounded-lg" />
                          : <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🪑</div>
                        }
                        <span className="font-medium text-gray-800 line-clamp-1">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{p.brand_name}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{p.category_name}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{formatPrice(p.sellingPrice)}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.totalSold} units</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 20 ? "bg-green-100 text-green-700" : p.stock > 5 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}