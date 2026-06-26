"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Download, X, FileText, BarChart2, Package, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  getReportStatsApi,
  exportOrdersReportApi,
  exportInventoryReportApi,
} from "@/services/report.service";

// ✅ CSV download helper
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState("");

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  useEffect(() => {
    const fetchStats = async () => {
      const res: any = await getReportStatsApi();
      if (res?.success) setData(res.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  // ✅ Sales report — monthlySales se
  const handleExportSalesReport = () => {
    if (!data) return;
    downloadCSV(
      "sales_report.csv",
      ["Month", "Revenue (₹)", "Orders", "Avg Order Value (₹)"],
      data.monthlySales.map((m: any) => [
        m.month, m.revenue, m.orders,
        m.orders > 0 ? Math.round(m.revenue / m.orders) : 0,
      ])
    );
    setShowExportModal(false);
    toast.success("Sales Report exported!");
  };

  // ✅ Orders report — API se
  const handleExportOrdersReport = async () => {
    setExporting("orders");
    const res: any = await exportOrdersReportApi();
    if (res?.success) {
      downloadCSV(
        "orders_report.csv",
        ["Order ID", "Customer", "Mobile", "City", "Date", "Items", "Total (₹)", "Payment", "Status"],
        res.data.map((o: any) => [
          o.order_id, o.customer, o.mobile, o.city,
          o.date, o.items, o.total, o.payment_status, o.order_status,
        ])
      );
      setShowExportModal(false);
      toast.success("Orders Report exported!");
    }
    setExporting("");
  };

  // ✅ Inventory report — API se
  const handleExportInventoryReport = async () => {
    setExporting("inventory");
    const res: any = await exportInventoryReportApi();
    if (res?.success) {
      downloadCSV(
        "inventory_report.csv",
        ["SKU", "Product Name", "Brand", "Category", "MRP (₹)", "Selling Price (₹)", "Stock", "Stock Status"],
        res.data.map((p: any) => [
          p.sku, p.product_name, p.brand, p.category,
          p.mrp, p.sellingPrice, p.stock, p.stock_status,
        ])
      );
      setShowExportModal(false);
      toast.success("Inventory Report exported!");
    }
    setExporting("");
  };

  // ✅ Top products report — data se
  const handleExportTopProducts = () => {
    if (!data) return;
    downloadCSV(
      "top_products_report.csv",
      ["Rank", "Product", "Brand", "Category", "Price (₹)", "Sold", "Revenue (₹)", "Stock"],
      data.topProducts.map((p: any, i: number) => [
        i + 1, p.product_name, p.brand_name, p.category_name,
        p.sellingPrice, p.totalSold, p.totalRevenue, p.stock,
      ])
    );
    setShowExportModal(false);
    toast.success("Top Products Report exported!");
  };

  // ✅ Payment report — data se
  const handleExportPaymentReport = () => {
    if (!data) return;
    downloadCSV(
      "payment_methods_report.csv",
      ["Payment Method", "Order Count", "Percentage (%)"],
      data.paymentBreakdown.map((p: any) => [p.method, p.count, p.pct])
    );
    setShowExportModal(false);
    toast.success("Payment Report exported!");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-amber-600" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-20 text-gray-400">Failed to load reports</div>
  );

  const { summary, monthlySales, paymentBreakdown, topProducts, inventory } = data;
  const maxRev = Math.max(...monthlySales.map((m: any) => m.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-400">Business performance overview</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium"
        >
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(summary.totalRevenue) },
          { label: "Total Orders", value: summary.totalOrders.toString() },
          { label: "Avg. Order Value", value: formatPrice(summary.avgOrderValue) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp size={11} /> All time
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">Monthly Revenue (Last 6 Months)</h2>
          {monthlySales.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No data yet</p>
          ) : (
            <div className="flex items-end gap-4 h-44">
              {monthlySales.map(({ month, revenue }: any) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-medium">
                    {formatPrice(revenue / 1000)}K
                  </span>
                  <div
                    className="w-full bg-amber-500 hover:bg-amber-600 transition-colors rounded-t-lg"
                    style={{ height: `${Math.max((revenue / maxRev) * 110, revenue > 0 ? 8 : 0)}px` }}
                  />
                  <span className="text-xs text-gray-400">{month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Payment Methods</h2>
          <div className="space-y-4">
            {paymentBreakdown.map(({ method, count, pct }: any) => (
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
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Rank", "Product", "Brand", "Price", "Sold", "Revenue", "Stock"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p: any, i: number) => (
                  <tr key={String(p.id)} className="hover:bg-amber-50/50">
                    <td className="px-5 py-3.5">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {p.product_image
                          ? <img src={p.product_image} alt="" className="w-9 h-9 object-cover rounded-lg" />
                          : <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🪑</div>
                        }
                        <span className="font-medium text-gray-800 line-clamp-1 max-w-[160px]">{p.product_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.brand_name}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{formatPrice(p.sellingPrice)}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.totalSold} units</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-700">{formatPrice(p.totalRevenue)}</td>
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

      {/* Inventory Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Inventory Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: inventory.totalProducts, color: "text-gray-900" },
            { label: "In Stock", value: inventory.inStock, color: "text-green-700" },
            { label: "Low Stock (≤ 10)", value: inventory.lowStock, color: "text-orange-600" },
            { label: "Out of Stock", value: inventory.outOfStock, color: "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Modal */}
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
                  file: "sales_report.csv",
                  onClick: handleExportSalesReport,
                  key: "sales",
                },
                {
                  icon: <FileText size={18} className="text-blue-600" />,
                  title: "Orders Report",
                  desc: "All orders with customer & status details",
                  file: "orders_report.csv",
                  onClick: handleExportOrdersReport,
                  key: "orders",
                },
                {
                  icon: <Package size={18} className="text-green-600" />,
                  title: "Inventory Report",
                  desc: "All products with stock & price details",
                  file: "inventory_report.csv",
                  onClick: handleExportInventoryReport,
                  key: "inventory",
                },
                {
                  icon: <TrendingUp size={18} className="text-purple-600" />,
                  title: "Top Products Report",
                  desc: "Top 5 performing products by sales & revenue",
                  file: "top_products_report.csv",
                  onClick: handleExportTopProducts,
                  key: "top",
                },
                {
                  icon: <Download size={18} className="text-indigo-600" />,
                  title: "Payment Methods Report",
                  desc: "Payment breakdown by method & percentage",
                  file: "payment_methods_report.csv",
                  onClick: handleExportPaymentReport,
                  key: "payment",
                },
              ].map(({ icon, title, desc, file, onClick, key }) => (
                <button
                  key={title}
                  onClick={onClick}
                  disabled={exporting === key}
                  className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group disabled:opacity-60"
                >
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    {exporting === key ? <Loader2 size={18} className="animate-spin text-amber-600" /> : icon}
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