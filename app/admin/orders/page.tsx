"use client";

import { useState } from "react";
import { orders as initialOrders } from "@/lib/data";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Search, Download, Eye, Edit2, X } from "lucide-react";

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  "Order Placed": "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  "Return Initiated": "bg-orange-100 text-orange-700",
  Refunded: "bg-indigo-100 text-indigo-700",
  "Payment Confirmed": "bg-teal-100 text-teal-700",
  Packed: "bg-cyan-100 text-cyan-700",
};

const allStatuses: OrderStatus[] = ["Order Placed","Payment Confirmed","Processing","Packed","Shipped","Out for Delivery","Delivered","Cancelled","Return Initiated","Refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("Processing");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(search) || o.address.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = () => {
    if (!editOrder) return;
    setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, status: newStatus } : o));
    setEditOrder(null);
    showToast("✅ Order status updated!");
  };

  const handleExportCSV = () => {
    const headers = ["Order ID","Customer","Mobile","Date","Items","Total","Payment","Status"];
    const rows = filtered.map(o => [
      o.id,
      o.address.name,
      o.address.mobile,
      new Date(o.date).toLocaleDateString("en-IN"),
      o.items.length,
      o.total,
      o.paymentMethod,
      o.status,
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✅ CSV exported!");
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">{toast}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400">{orders.length} total orders</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Status tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-1 flex gap-1 flex-wrap">
        {["All", ...allStatuses].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === s ? "bg-amber-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>{s}</button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search by order ID or customer name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Order ID","Customer","Date","Items","Total","Payment","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{order.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{order.address.name}</div>
                    <div className="text-xs text-gray-400">{order.address.mobile}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item) => (
                        <img key={item.product.id} src={item.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-white" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{order.items.length} item(s)</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{order.paymentMethod}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewOrder(order)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} /></button>
                      <button onClick={() => { setEditOrder(order); setNewStatus(order.status); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg" title="Update Status"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {/* VIEW ORDER MODAL */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-serif text-lg font-bold text-gray-900">Order {viewOrder.id}</h2>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[viewOrder.status] || "bg-gray-100 text-gray-600"}`}>{viewOrder.status}</span>
                <span className="text-xs text-gray-400">{new Date(viewOrder.date).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                <p className="font-medium text-gray-800">{viewOrder.address.name}</p>
                <p className="text-gray-600">{viewOrder.address.mobile}</p>
                <p className="text-gray-600">{viewOrder.address.address}</p>
                <p className="text-gray-600">{viewOrder.address.city}, {viewOrder.address.state} - {viewOrder.address.pincode}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Items</h3>
                <div className="space-y-3">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm truncate">{item.product.name}</div>
                        <div className="text-xs text-gray-400">{item.selectedColor} · Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">{formatPrice(item.product.sellingPrice * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Payment</span><span>{viewOrder.paymentMethod}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>{formatPrice(viewOrder.total)}</span></div>
              </div>
            </div>
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
              <p className="text-sm text-gray-500">Order <span className="font-semibold text-gray-800">{editOrder.id}</span></p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as OrderStatus)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400">
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={`text-xs font-semibold px-3 py-2 rounded-lg inline-block ${statusColors[newStatus] || "bg-gray-100 text-gray-600"}`}>{newStatus}</div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditOrder(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdateStatus} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
