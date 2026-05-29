"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { products, orders } from "@/lib/data";
import { TrendingUp, Download, X, FileText, BarChart2, Package } from "lucide-react";

const monthlySales = [
  { month: "Aug", revenue: 145000, orders: 12 },
  { month: "Sep", revenue: 198000, orders: 16 },
  { month: "Oct", revenue: 167000, orders: 14 },
  { month: "Nov", revenue: 234000, orders: 19 },
  { month: "Dec", revenue: 312000, orders: 25 },
  { month: "Jan", revenue: 278000, orders: 22 },
];
const maxRev = Math.max(...monthlySales.map((m) => m.revenue));

const paymentBreakdown = [
  { method: "UPI", count: 42, pct: 45 },
  { method: "Credit / Debit Card", count: 28, pct: 30 },
  { method: "Cash on Delivery", count: 15, pct: 16 },
  { method: "Net Banking", count: 8, pct: 9 },
];

const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleExportSalesReport = () => {
    downloadCSV(
      "sales_report.csv",
      ["Month", "Revenue (₹)", "Orders", "Avg Order Value (₹)"],
      monthlySales.map(m => [m.month, m.revenue, m.orders, Math.round(m.revenue / m.orders)])
    );
    setShowExportModal(false);
    showToast("✅ Sales Report exported!");
  };

  const handleExportOrdersReport = () => {
    downloadCSV(
      "orders_report.csv",
      ["Order ID", "Customer", "Mobile", "City", "Date", "Items", "Total (₹)", "Payment", "Status"],
      orders.map(o => [
        o.id,
        o.address.name,
        o.address.mobile,
        o.address.city,
        new Date(o.date).toLocaleDateString("en-IN"),
        o.items.length,
        o.total,
        o.paymentMethod,
        o.status,
      ])
    );
    setShowExportModal(false);
    showToast("✅ Orders Report exported!");
  };

  const handleExportInventoryReport = () => {
    downloadCSV(
      "inventory_report.csv",
      ["SKU", "Product Name", "Brand", "Category", "MRP (₹)", "Selling Price (₹)", "Stock Qty", "Stock Status", "Est. Revenue (₹)"],
      products.map(p => [
        p.sku,
        p.name,
        p.brand,
        p.category.replace(/-/g, " "),
        p.mrp,
        p.sellingPrice,
        p.stockQty,
        p.stockQty === 0 ? "Out of Stock" : p.stockQty <= 10 ? "Low Stock" : "In Stock",
        p.sellingPrice * Math.floor(p.reviewCount / 3),
      ])
    );
    setShowExportModal(false);
    showToast("✅ Inventory Report exported!");
  };

  const handleExportTopProducts = () => {
    downloadCSV(
      "top_products_report.csv",
      ["Rank", "Product Name", "Brand", "Category", "Selling Price (₹)", "MRP (₹)", "Reviews", "Rating", "Stock", "Est. Revenue (₹)"],
      topProducts.map((p, i) => [
        i + 1,
        p.name,
        p.brand,
        p.category.replace(/-/g, " "),
        p.sellingPrice,
        p.mrp,
        p.reviewCount,
        p.rating,
        p.stockQty,
        p.sellingPrice * Math.floor(p.reviewCount / 3),
      ])
    );
    setShowExportModal(false);
    showToast("✅ Top Products Report exported!");
  };

  const handleExportPaymentReport = () => {
    downloadCSV(
      "payment_methods_report.csv",
      ["Payment Method", "Order Count", "Percentage (%)"],
      paymentBreakdown.map(p => [p.method, p.count, p.pct])
    );
    setShowExportModal(false);
    showToast("✅ Payment Report exported!");
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">{toast}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-400">Business performance overview</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (6M)", value: formatPrice(monthlySales.reduce((s, m) => s + m.revenue, 0)), tag: "↑ 18%" },
          { label: "Total Orders (6M)", value: monthlySales.reduce((s, m) => s + m.orders, 0).toString(), tag: "↑ 12%" },
          { label: "Avg. Order Value", value: formatPrice(18500), tag: "↑ 6%" },
          { label: "Return Rate", value: "3.2%", tag: "↓ 1.1%" },
        ].map(({ label, value, tag }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp size={11} /> {tag} vs prev period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">Monthly Revenue (Last 6 Months)</h2>
          <div className="flex items-end gap-4 h-44">
            {monthlySales.map(({ month, revenue }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-gray-400 font-medium">{formatPrice(revenue / 1000)}K</span>
                <div className="w-full bg-amber-500 hover:bg-amber-600 transition-colors rounded-t-lg" style={{ height: `${(revenue / maxRev) * 110}px` }} />
                <span className="text-xs text-gray-400">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Payment Methods</h2>
          <div className="space-y-4">
            {paymentBreakdown.map(({ method, count, pct }) => (
              <div key={method}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{method}</span>
                  <span className="font-semibold text-gray-800">{count} orders ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Rank","Product","Brand","Price","Reviews","Stock","Revenue Est."].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => (
                <tr key={p.id} className="hover:bg-amber-50/50">
                  <td className="px-5 py-3.5">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded-lg" />
                      <span className="font-medium text-gray-800 line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.brand}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{formatPrice(p.sellingPrice)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{p.reviewCount}</td>
                  <td className="px-5 py-3.5 text-gray-500">{p.stockQty}</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-700">{formatPrice(p.sellingPrice * Math.floor(p.reviewCount / 3))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Report */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Inventory Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length, color: "text-gray-900" },
            { label: "In Stock", value: products.filter(p => p.stockQty > 10).length, color: "text-green-700" },
            { label: "Low Stock (≤ 10)", value: products.filter(p => p.stockQty <= 10 && p.stockQty > 0).length, color: "text-orange-600" },
            { label: "Out of Stock", value: products.filter(p => p.stockQty === 0).length, color: "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Export Report</h2>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-500 mb-4">Kaunsa report export karna chahte hain?</p>

              {[
                {
                  icon: <BarChart2 size={18} className="text-amber-600" />,
                  title: "Sales Report",
                  desc: "Monthly revenue, orders & average order value",
                  onClick: handleExportSalesReport,
                  file: "sales_report.csv",
                },
                {
                  icon: <FileText size={18} className="text-blue-600" />,
                  title: "Orders Report",
                  desc: `All ${orders.length} orders with customer & status details`,
                  onClick: handleExportOrdersReport,
                  file: "orders_report.csv",
                },
                {
                  icon: <Package size={18} className="text-green-600" />,
                  title: "Inventory Report",
                  desc: `All ${products.length} products with stock & price details`,
                  onClick: handleExportInventoryReport,
                  file: "inventory_report.csv",
                },
                {
                  icon: <TrendingUp size={18} className="text-purple-600" />,
                  title: "Top Products Report",
                  desc: "Top 5 performing products by reviews & revenue",
                  onClick: handleExportTopProducts,
                  file: "top_products_report.csv",
                },
                {
                  icon: <Download size={18} className="text-indigo-600" />,
                  title: "Payment Methods Report",
                  desc: "Payment breakdown by method & percentage",
                  onClick: handleExportPaymentReport,
                  file: "payment_methods_report.csv",
                },
              ].map(({ icon, title, desc, onClick, file }) => (
                <button
                  key={title}
                  onClick={onClick}
                  className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-sm">{title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    <div className="text-xs text-amber-600 font-mono mt-0.5">{file}</div>
                  </div>
                  <Download size={15} className="text-gray-300 group-hover:text-amber-500 flex-shrink-0" />
                </button>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
