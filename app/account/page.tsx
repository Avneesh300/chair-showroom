"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getOrdersApi, cancelOrderApi, getOrderDetailApi } from "@/services/order.service";
import { useAuth } from "@/context/AuthContext";
import { Package, ChevronRight, LogOut, Loader2, Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { submitReviewApi } from "@/services/review.service";

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

const paymentColors: Record<string, string> = {
  "PENDING": "bg-orange-100 text-orange-700",
  "SUCCESS": "bg-green-100 text-green-700",
  "FAILED": "bg-red-100 text-red-600",
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, any>>({});
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null); // ✅ NEW
  const [reviewModalItem, setReviewModalItem] = useState<{ orderId: string; productId: string; productName: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    const response: any = await getOrdersApi({ page, limit: 5,   myOrdersOnly: true,  });
    if (response?.success) {
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setCurrentPage(page);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    const response: any = await cancelOrderApi({ id: orderId, orderStatus: "CANCELLED" });
    if (response?.success) {
      toast.success("Order cancelled successfully");
      fetchOrders(currentPage);
    } else {
      toast.error(response?.message || "Cancel failed");
    }
    setCancellingId(null);
  };

  const handleDownloadInvoice = async (order: any) => {
    setDownloadingId(order.id);
    const response: any = await getOrderDetailApi({ id: order.id });
    const orderDetail = response?.success ? response.data : order;

    const invoiceContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${String(orderDetail.id).slice(-8).toUpperCase()}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #92400e; }
        .label { color: #888; font-size: 12px; }
        .value { font-weight: bold; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #fef3c7; padding: 10px; text-align: left; font-size: 13px; }
        td { padding: 10px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
        .footer { margin-top: 40px; text-align: center; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">🪑 SRS Chair Showroom</div>
          <div style="font-size:12px; color:#888; margin-top:4px;">
            123 Chair Market, Lucknow, UP – 226001<br/>
            info@srschairs.com | 1800-XXX-XXXX
          </div>
        </div>
        <div style="text-align:right;">
          <div class="title" style="font-size:20px;">INVOICE</div>
          <div class="label">Order ID</div>
          <div class="value">#${String(orderDetail.id).slice(-8).toUpperCase()}</div>
          <div class="label" style="margin-top:5px;">Date</div>
          <div class="value">${new Date(orderDetail.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <hr style="border:1px solid #fde68a; margin: 20px 0;"/>
      <div style="margin-bottom:20px;">
        <div class="label">Delivery To</div>
        <div class="value">${orderDetail.full_name || ""}</div>
        <div style="font-size:12px; color:#888;">${orderDetail.address || ""}, ${orderDetail.city || ""}, ${orderDetail.state || ""} - ${orderDetail.pincode || ""}</div>
        <div style="font-size:12px; color:#888;">📞 ${orderDetail.mobile || ""}</div>
      </div>
      <div style="margin-bottom:20px;">
        <div class="label">Order Status: <b>${orderDetail.orderStatus}</b> &nbsp;&nbsp; Payment: <b>${orderDetail.paymentStatus}</b></div>
      </div>
      <table>
        <thead>
          <tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${orderDetail.items?.length > 0
        ? orderDetail.items.map((item: any, i: number) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.productName || "Product"}</td>
                  <td>${item.quantity}</td>
                  <td>₹${Number(item.price).toLocaleString("en-IN")}</td>
                  <td>₹${Number(item.price * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              `).join("")
        : `<tr><td colspan="5" style="text-align:center; color:#aaa;">No items found</td></tr>`
      }
        </tbody>
      </table>
      <div style="text-align:right; margin-top:10px;">
        <table style="margin-left:auto; width:250px;">
          <tr><td class="label">Subtotal</td><td class="value">₹${Number(orderDetail.subtotal || orderDetail.totalAmount).toLocaleString("en-IN")}</td></tr>
          ${orderDetail.discountAmount > 0 ? `<tr><td class="label" style="color:green;">Discount</td><td class="value" style="color:green;">-₹${Number(orderDetail.discountAmount).toLocaleString("en-IN")}</td></tr>` : ""}
          <tr><td class="label">Shipping</td><td class="value">${orderDetail.shippingCharge === 0 ? "FREE" : `₹${Number(orderDetail.shippingCharge).toLocaleString("en-IN")}`}</td></tr>
          <tr><td style="padding-top:10px; font-size:16px; font-weight:bold;">Total</td><td style="padding-top:10px; font-size:16px; font-weight:bold; color:#92400e;">₹${Number(orderDetail.totalAmount).toLocaleString("en-IN")}</td></tr>
        </table>
      </div>
      <div class="footer">
        <p>Thank you for shopping with SRS Chair Showroom!</p>
        <p>For support: support@srschairs.com | 1800-XXX-XXXX</p>
      </div>
    </body>
    </html>`;

    const blob = new Blob([invoiceContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${String(orderDetail.id).slice(-8).toUpperCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded!");
    setDownloadingId(null);
  };

  // ✅ Order expand karo
  const toggleOrderItems = async (orderId: string) => {
    if (expandedOrders[orderId]) {
      setExpandedOrders(prev => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      return;
    }
    setLoadingDetailId(orderId); // ✅ loading state
    const response: any = await getOrderDetailApi({ id: orderId });
    console.log("Order detail response:", response); // ✅ debug — console mein check karo

    if (response?.success) {
      setExpandedOrders(prev => ({ ...prev, [orderId]: response.data }));
    } else {
      toast.error("Failed to load order items");
    }
    setLoadingDetailId(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewModalItem) return;
    if (!reviewForm.review.trim()) { toast.error("Please write a review"); return; }

    setSubmittingReview(true);
    const response: any = await submitReviewApi({
      orderId: reviewModalItem.orderId,
      productId: reviewModalItem.productId,
      rating: reviewForm.rating,
      review: reviewForm.review,
    });
    if (response?.success) {
      toast.success("Review submitted successfully!");
      setReviewModalItem(null);
      setReviewForm({ rating: 5, review: "" });
    } else {
      toast.error(response?.message || "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">👤</div>
            <div className="flex-1">
              <h1 className="font-serif text-xl font-bold text-gray-900">{user?.full_name || "User"}</h1>
              <p className="text-sm text-gray-500">{user?.email} • {user?.mobile || ""}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium border border-red-100 hover:border-red-300 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>

          <h2 className="font-serif text-xl font-bold text-amber-950 mb-4">My Orders</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-amber-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package size={48} className="mx-auto text-gray-200 mb-3" />
              <h3 className="font-semibold text-gray-600 mb-1">No orders yet</h3>
              <p className="text-sm text-gray-400 mb-4">Start shopping to see your orders here</p>
              <Link href="/products" className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800">
                Browse Chairs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const orderDetail = expandedOrders[order.id];
                const isLoadingDetail = loadingDetailId === order.id;
                const canReview = order.orderStatus === "DELIVERED" && order.paymentStatus === "SUCCESS";

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-50">
                      <div>
                        <span className="text-xs text-gray-400">Order ID</span>
                        <div className="font-semibold text-sm text-gray-800 font-mono">{String(order.id).slice(-8).toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Date</span>
                        <div className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Items</span>
                        <div className="text-sm text-gray-700">{order.totalItems} item{order.totalItems > 1 ? "s" : ""}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Total</span>
                        <div className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleOrderItems(order.id)}
                        disabled={isLoadingDetail}
                        className="flex items-center gap-1 text-amber-700 text-sm font-medium hover:text-amber-900 disabled:opacity-60"
                      >
                        {isLoadingDetail
                          ? <><Loader2 size={13} className="animate-spin" /> Loading...</>
                          : <>{orderDetail ? "Hide Details" : "View Details"} <ChevronRight size={14} className={orderDetail ? "rotate-90" : ""} /></>
                        }
                      </button>
                    </div>

                    {/* ✅ Items list */}
                    {orderDetail && (
                      <div className="px-5 py-4 space-y-3 bg-gray-50/50">
                        {!orderDetail.items || orderDetail.items.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-2">No items found in this order</p>
                        ) : (
                          orderDetail.items.map((item: any, idx: number) => (
                            <div key={item.productId || idx} className="flex items-center gap-3">
                              {item.productImage
                                ? <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                                : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🪑</div>
                              }
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800">{item.productName || "Product"}</div>
                                <div className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                              </div>
                              {canReview && (
                                <button
                                  onClick={() => setReviewModalItem({
                                    orderId: order.id,
                                    productId: item.productId,
                                    productName: item.productName || "Product",
                                  })}
                                  className="text-xs border border-amber-300 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 flex-shrink-0"
                                >
                                  Write Review
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="px-5 py-3 flex gap-3 border-t border-gray-50">
                      {order.orderStatus === "PLACED" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="flex items-center gap-1.5 text-xs border border-red-300 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancellingId === order.id ? <><Loader2 size={12} className="animate-spin" /> Cancelling...</> : "Cancel Order"}
                        </button>
                      )}
                      {order.orderStatus === "DELIVERED" && (
                        <button className="text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50">
                          Return Item
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        disabled={downloadingId === order.id}
                        className="text-xs border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 disabled:opacity-60"
                      >
                        {downloadingId === order.id ? "Generating..." : "Download Invoice"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  <button
                    onClick={() => fetchOrders(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => fetchOrders(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* ✅ REVIEW MODAL — page level pe, list ke bahar */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Write a Review</h2>
              <button onClick={() => setReviewModalItem(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Reviewing: <span className="font-medium text-gray-800">{reviewModalItem.productName}</span>
              </p>
              <div>
                <p className="text-xs text-gray-500 mb-2">Rating*</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}>
                      <Star size={28} className={star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Your Review*</p>
                <textarea
                  rows={4}
                  value={reviewForm.review}
                  onChange={e => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => { setReviewModalItem(null); setReviewForm({ rating: 5, review: "" }); }} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-xl flex items-center gap-2"
              >
                {submittingReview && <Loader2 size={14} className="animate-spin" />} Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}