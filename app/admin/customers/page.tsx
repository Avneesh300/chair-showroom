"use client";

import { useState } from "react";
import { Search, UserX, Mail, Eye, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Customer {
  id: string; name: string; email: string; mobile: string; city: string;
  orders: number; totalSpent: number; joined: string; status: "Active" | "Blocked";
}

const initialCustomers: Customer[] = [
  { id: "c1", name: "Rahul Sharma", email: "rahul@example.com", mobile: "9876543210", city: "Noida", orders: 3, totalSpent: 45297, joined: "2024-08-15", status: "Active" },
  { id: "c2", name: "Priya Gupta", email: "priya@example.com", mobile: "9812345678", city: "Lucknow", orders: 1, totalSpent: 12999, joined: "2024-10-22", status: "Active" },
  { id: "c3", name: "Vikash Kumar", email: "vikash@example.com", mobile: "9898989898", city: "Delhi", orders: 5, totalSpent: 98450, joined: "2024-06-01", status: "Active" },
  { id: "c4", name: "Sunita Devi", email: "sunita@example.com", mobile: "9753108642", city: "Agra", orders: 2, totalSpent: 71998, joined: "2024-11-05", status: "Active" },
  { id: "c5", name: "Arjun Singh", email: "arjun@example.com", mobile: "9001234567", city: "Kanpur", orders: 0, totalSpent: 0, joined: "2025-01-10", status: "Active" },
  { id: "c6", name: "Meena Patel", email: "meena@example.com", mobile: "9654321098", city: "Varanasi", orders: 1, totalSpent: 5999, joined: "2024-12-20", status: "Blocked" },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [emailCustomer, setEmailCustomer] = useState<Customer | null>(null);
  const [blockCustomer, setBlockCustomer] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const handleToggleBlock = () => {
    if (!blockCustomer) return;
    setCustomers(prev => prev.map(c => c.id === blockCustomer.id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c));
    const action = blockCustomer.status === "Blocked" ? "Unblocked" : "Blocked";
    setBlockCustomer(null);
    showToast(`✅ Customer ${action} successfully.`);
  };

  const handleSendEmail = () => {
    if (!emailCustomer) return;
    // Simulate sending email - open mailto
    window.open(`mailto:${emailCustomer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    setEmailCustomer(null);
    setEmailSubject("");
    setEmailBody("");
    showToast(`✉️ Email client opened for ${emailCustomer.name}`);
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">{toast}</div>}

      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-400">{customers.length} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Active", value: customers.filter(c => c.status === "Active").length },
          { label: "New This Month", value: 2 },
          { label: "Blocked", value: customers.filter(c => c.status === "Blocked").length },
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
          <input type="text" placeholder="Search by name, email, or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Customer","Mobile","City","Orders","Total Spent","Joined","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-semibold text-amber-700">{c.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium text-gray-800">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.mobile}</td>
                  <td className="px-5 py-4 text-gray-600">{c.city}</td>
                  <td className="px-5 py-4 text-gray-600">{c.orders}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{c.totalSpent > 0 ? `₹${c.totalSpent.toLocaleString("en-IN")}` : "—"}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">{new Date(c.joined).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewCustomer(c)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} /></button>
                      <button onClick={() => { setEmailCustomer(c); setEmailSubject(""); setEmailBody(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg" title="Email"><Mail size={14} /></button>
                      <button onClick={() => setBlockCustomer(c)} className={`w-7 h-7 flex items-center justify-center rounded-lg ${c.status === "Blocked" ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`} title={c.status === "Blocked" ? "Unblock" : "Block"}><UserX size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {customers.length} customers
        </div>
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
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl font-bold text-amber-700">{viewCustomer.name.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{viewCustomer.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${viewCustomer.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{viewCustomer.status}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Email", viewCustomer.email],
                  ["Mobile", viewCustomer.mobile],
                  ["City", viewCustomer.city],
                  ["Total Orders", `${viewCustomer.orders}`],
                  ["Total Spent", viewCustomer.totalSpent > 0 ? `₹${viewCustomer.totalSpent.toLocaleString("en-IN")}` : "—"],
                  ["Member Since", new Date(viewCustomer.joined).toLocaleDateString("en-IN")],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
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
              <div className="text-sm text-gray-600">To: <span className="font-medium text-gray-800">{emailCustomer.name}</span> ({emailCustomer.email})</div>
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
              <button onClick={handleSendEmail} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK/UNBLOCK CONFIRM */}
      {blockCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${blockCustomer.status === "Blocked" ? "bg-green-100" : "bg-red-100"}`}>
              <UserX size={22} className={blockCustomer.status === "Blocked" ? "text-green-600" : "text-red-600"} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">{blockCustomer.status === "Blocked" ? "Unblock" : "Block"} Customer?</h3>
              <p className="text-sm text-gray-500 mt-1">
                {blockCustomer.status === "Blocked"
                  ? `"${blockCustomer.name}" will be reactivated and can login again.`
                  : `"${blockCustomer.name}" will be blocked and cannot login.`}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBlockCustomer(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleToggleBlock} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white ${blockCustomer.status === "Blocked" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                {blockCustomer.status === "Blocked" ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
