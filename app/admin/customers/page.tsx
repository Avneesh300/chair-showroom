"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, UserX, Mail, Eye, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getUsersApi, updateUserStatusApi, sendEmailToUserApi } from "@/services/user.service";
import { getOrdersApi } from "@/services/order.service";
import Pagination from "@/components/common/Pagination";


export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [viewCustomer, setViewCustomer] = useState<any | null>(null);
  const [viewOrders, setViewOrders] = useState<any[]>([]);
  const [viewOrdersLoading, setViewOrdersLoading] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState<any | null>(null);
  const [blockCustomer, setBlockCustomer] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [updating, setUpdating] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;

  const fetchCustomers = async (page = 1, searchVal = search) => {
    setLoading(true);
    const response: any = await getUsersApi({ page, limit: 10, search: searchVal });
    if (response?.success) {
      setCustomers(response.data.users);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalCount(response.data.pagination?.total || 0);
      setCurrentPage(page);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(1, search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // View customer + fetch their orders
  const handleViewCustomer = async (customer: any) => {
    setViewCustomer(customer);
    setViewOrders([]);
    setViewOrdersLoading(true);
    // Admin orders API se is user ke orders fetch karo
    // Note: getAllOrders mein user filter support nahi hai abhi
    // Isliye total orders count sirf dikhayenge
    setViewOrdersLoading(false);
  };

  const handleToggleBlock = async () => {
    if (!blockCustomer || updating) return;
    setUpdating(true);
    const response: any = await updateUserStatusApi({
      id: blockCustomer._id,
      status: blockCustomer.status === "0" ? "B" : "A",
    });
    if (response?.success) {
      toast.success(response.message);
      setBlockCustomer(null);
      fetchCustomers(currentPage);
    } else {
      toast.error(response?.message || "Update failed");
    }
    setUpdating(false);
  };

  const handleSendEmail = async () => {
    if (!emailCustomer) return;
    if (!emailSubject) { toast.error("Subject required"); return; }
    if (!emailBody) { toast.error("Message required"); return; }

    setEmailSending(true);
    const response: any = await sendEmailToUserApi({
      email: emailCustomer.email,
      subject: emailSubject,
      message: emailBody,
    });

    if (response?.success) {
      toast.success(`Email sent to ${emailCustomer.full_name}`);
      setEmailCustomer(null);
      setEmailSubject("");
      setEmailBody("");
    } else {
      toast.error(response?.message || "Email sending failed");
    }
    setEmailSending(false);
  };

  const activeCount = customers.filter(c => c.status === "1").length;
  const blockedCount = customers.filter(c => c.status === "0").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-400">{totalCount} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: totalCount },
          { label: "Active", value: activeCount },
          { label: "Blocked", value: blockedCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-amber-400">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Customer", "Mobile", "Orders", "Total Spent", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center"><Loader2 size={24} className="animate-spin text-amber-600 mx-auto" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">No customers found</td></tr>
              ) : customers.map((c) => (
                <tr key={c._id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-semibold text-amber-700">
                        {c.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{c.full_name}</div>
                        <div className="text-xs text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.mobile || "-"}</td>
                  <td className="px-5 py-4 text-gray-600">{c.totalOrders || 0}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {c.totalSpent > 0 ? formatPrice(c.totalSpent) : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.status === "1" ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleViewCustomer(c)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} /></button>
                      <button onClick={() => { setEmailCustomer(c); setEmailSubject(""); setEmailBody(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg" title="Email"><Mail size={14} /></button>
                      <button
                        onClick={() => setBlockCustomer(c)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg ${c.status === "0" ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}
                        title={c.status === "0" ? "Unblock" : "Block"}
                      >
                        <UserX size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={(page) => fetchCustomers(page)} />
      </div>

      {/* VIEW MODAL */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Customer Details</h2>
              <button onClick={() => setViewCustomer(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl font-bold text-amber-700">
                  {viewCustomer.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{viewCustomer.full_name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${viewCustomer.status === "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewCustomer.status === "1" ? "Active" : "Blocked"}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Email", viewCustomer.email],
                  ["Mobile", viewCustomer.mobile || "-"],
                  ["Total Orders", `${viewCustomer.totalOrders || 0}`],
                  ["Total Spent", viewCustomer.totalSpent > 0 ? formatPrice(viewCustomer.totalSpent) : "—"],
                  ["Login Type", viewCustomer.loginType],
                  ["Member Since", new Date(viewCustomer.createdAt).toLocaleDateString("en-IN")],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800 capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewCustomer(null)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL MODAL */}
      {emailCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Send Email</h2>
              <button onClick={() => setEmailCustomer(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-sm text-gray-600">
                To: <span className="font-medium text-gray-800">{emailCustomer.full_name}</span> ({emailCustomer.email})
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Subject</label>
                <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" placeholder="Email subject..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Message</label>
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none" placeholder="Write your message..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEmailCustomer(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button 
               onClick={handleSendEmail} 
               disabled={emailSending}
                className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white rounded-xl flex items-center gap-2"
              >
                {emailSending && <Loader2 size={14} className="animate-spin" />}
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK/UNBLOCK CONFIRM */}
      {blockCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${blockCustomer.status === "0" ? "bg-green-100" : "bg-red-100"}`}>
              <UserX size={22} className={blockCustomer.status === "0" ? "text-green-600" : "text-red-600"} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">
                {blockCustomer.status === "0" ? "Unblock" : "Block"} Customer?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {blockCustomer.status === "0"
                  ? `"${blockCustomer.full_name}" will be reactivated and can login again.`
                  : `"${blockCustomer.full_name}" will be blocked and cannot login.`}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBlockCustomer(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleToggleBlock}
                disabled={updating}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 ${blockCustomer.status === "0" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} disabled:opacity-60`}
              >
                {updating && <Loader2 size={14} className="animate-spin" />}
                {blockCustomer.status === "0" ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}