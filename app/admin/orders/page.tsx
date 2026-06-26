"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, Edit2, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getOrdersApi, getOrderDetailApi, paymentStatusUpdateApi, } from "@/services/order.service";
import Pagination from "@/components/common/Pagination";
import api from "@/lib/axiosInstance";
import { asyncHandler } from "@/lib/asyncHandler";

// ✅ Status update API
const orderStatusUpdateApi = asyncHandler(async (payload: any) => {
  const response = await api.post("/orders/status-update", payload);
  return response.data;
});

const statusColors: Record<string, string> = {
  PLACED: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
};

const allStatuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [viewOrder, setViewOrder] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const paymentStatuses = ["PENDING", "SUCCESS", "FAILED"];


  const [editPaymentOrder, setEditPaymentOrder] = useState<any | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);


  const handleUpdatePaymentStatus = async () => {
    if (!editPaymentOrder || !newPaymentStatus) return;
    setUpdatingPayment(true);
    const response: any = await paymentStatusUpdateApi({ id: editPaymentOrder.id, paymentStatus: newPaymentStatus });
    if (response?.success) {
      toast.success(response.message);
      setEditPaymentOrder(null);
      fetchOrders(currentPage);
    } else {
      toast.error(response?.message || "Update failed");
    }
    setUpdatingPayment(false);
  };

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    const response: any = await getOrdersApi({ page, limit: 10 });
    if (response?.success) {
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalCount(response.data.pagination?.total || 0);
      setCurrentPage(page);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleViewOrder = async (order: any) => {
    setViewOrder(order);
    setViewLoading(true);
    const response: any = await getOrderDetailApi({ id: order.id });
    if (response?.success) setViewOrder(response.data);
    setViewLoading(false);
  };

  const handleUpdateStatus = async () => {
    if (!editOrder || !newStatus) return;
    setUpdating(true);
    const response: any = await orderStatusUpdateApi({ id: editOrder.id, orderStatus: newStatus });
    if (response?.success) {
      toast.success(response.message);
      setEditOrder(null);
      fetchOrders(currentPage);
    } else {
      toast.error(response?.message || "Update failed");
    }
    setUpdating(false);
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Mobile", "Date", "Items", "Total", "Payment Status", "Order Status"];
    const rows = orders.map(o => [
      String(o.id).slice(-8).toUpperCase(),
      o.customer?.full_name || "",
      o.customer?.mobile || "",
      new Date(o.createdAt).toLocaleDateString("en-IN"),
      o.totalItems,
      o.totalAmount,
      o.paymentStatus,
      o.orderStatus,
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  // Client side search + filter
  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      String(o.id).toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400">{totalCount} total orders</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-1 flex gap-1 flex-wrap">
        {["All", ...allStatuses].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === s ? "bg-amber-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search by order ID or customer name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center"><Loader2 size={24} className="animate-spin text-amber-600 mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap font-mono">
                    #{String(order.id).slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{order.customer?.full_name || "-"}</div>
                    <div className="text-xs text-gray-400">{order.customer?.mobile || ""}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{order.totalItems} item(s)</td>
                  <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">{formatPrice(order.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setEditPaymentOrder(order); setNewPaymentStatus(order.paymentStatus); }}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-75 transition-opacity ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}
                    >
                      {order.paymentStatus}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleViewOrder(order)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} /></button>
                      <button onClick={() => { setEditOrder(order); setNewStatus(order.orderStatus); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg" title="Update Status"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={(page) => fetchOrders(page)} />
      </div>

      {/* VIEW MODAL */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Order #{String(viewOrder.id).slice(-8).toUpperCase()}
              </h2>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {viewLoading ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-amber-600" /></div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[viewOrder.orderStatus] || "bg-gray-100"}`}>
                    {viewOrder.orderStatus}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentColors[viewOrder.paymentStatus] || "bg-gray-100"}`}>
                    {viewOrder.paymentStatus}
                  </span>
                  <span className="text-xs text-gray-400">
                    {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleDateString("en-IN") : ""}
                  </span>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                  <p className="font-medium text-gray-800">{viewOrder.full_name}</p>
                  <p className="text-gray-600">{viewOrder.mobile}</p>
                  <p className="text-gray-600">{viewOrder.address}</p>
                  <p className="text-gray-600">{viewOrder.city}, {viewOrder.state} - {viewOrder.pincode}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Items</h3>
                  <div className="space-y-3">
                    {viewOrder.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🪑</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate">{item.productName}</div>
                          <div className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(viewOrder.subtotal)}</span></div>
                  {viewOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>- {formatPrice(viewOrder.discountAmount)}</span></div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{viewOrder.shippingCharge === 0 ? "FREE" : formatPrice(viewOrder.shippingCharge)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(viewOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT STATUS MODAL */}
      {editOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Update Order Status</h2>
              <button onClick={() => setEditOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Order <span className="font-semibold text-gray-800">#{String(editOrder.id).slice(-8).toUpperCase()}</span>
              </p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400">
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={`text-xs font-semibold px-3 py-2 rounded-lg inline-block ${statusColors[newStatus] || "bg-gray-100 text-gray-600"}`}>
                {newStatus}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditOrder(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdateStatus} disabled={updating} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-xl flex items-center gap-2">
                {updating && <Loader2 size={14} className="animate-spin" />} Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PAYMENT STATUS MODAL */}
      {editPaymentOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Update Payment Status</h2>
              <button onClick={() => setEditPaymentOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Order <span className="font-semibold text-gray-800">#{String(editPaymentOrder.id).slice(-8).toUpperCase()}</span>
              </p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">New Payment Status</label>
                <select
                  value={newPaymentStatus}
                  onChange={e => setNewPaymentStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                >
                  {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={`text-xs font-semibold px-3 py-2 rounded-lg inline-block ${paymentColors[newPaymentStatus] || "bg-gray-100 text-gray-600"}`}>
                {newPaymentStatus}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditPaymentOrder(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleUpdatePaymentStatus}
                disabled={updatingPayment}
                className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-xl flex items-center gap-2"
              >
                {updatingPayment && <Loader2 size={14} className="animate-spin" />} Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}