"use client";

import { useState } from "react";
import { Save, Store, Truck, CreditCard, Bell } from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">Manage your store configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  activeTab === id ? "bg-amber-700 text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
          {activeTab === "general" && (
            <div className="space-y-5 max-w-2xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">General Settings</h2>
              {[
                { label: "Store Name", defaultValue: "SRS Chair Showroom" },
                { label: "Contact Email", defaultValue: "info@srschairs.com" },
                { label: "Contact Phone", defaultValue: "1800-XXX-XXXX" },
                { label: "Store Address", defaultValue: "123 Chair Market, Furniture Lane, Lucknow, UP – 226001" },
                { label: "GSTIN", defaultValue: "09AABCS1429B1Z9" },
                { label: "Instagram URL", defaultValue: "https://instagram.com/srschairs" },
                { label: "Facebook URL", defaultValue: "https://facebook.com/srschairs" },
                { label: "WhatsApp Number", defaultValue: "+91-9876543210" },
              ].map(({ label, defaultValue }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type="text"
                    defaultValue={defaultValue}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-5 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Shipping Settings</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Flat Shipping Rate (₹)</label>
                <input type="number" defaultValue="299" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Free Shipping Above (₹)</label>
                <input type="number" defaultValue="5000" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                <input type="checkbox" defaultChecked className="accent-amber-600 w-4 h-4" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Enable COD (Cash on Delivery)</p>
                  <p className="text-xs text-gray-500">Allow customers to pay at the time of delivery</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated Delivery Days</label>
                <input type="text" defaultValue="3-5 working days" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-5 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Payment Gateway</h2>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                ⚠️ Payment gateway keys are sensitive. Never share these with anyone.
              </div>
              {[
                { label: "Razorpay Key ID", placeholder: "rzp_live_XXXXXXXXXX", type: "text" },
                { label: "Razorpay Key Secret", placeholder: "••••••••••••••••", type: "password" },
                { label: "Razorpay Webhook Secret", placeholder: "••••••••••••••••", type: "password" },
              ].map(({ label, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Notification Settings</h2>
              {[
                { label: "Order Placed", desc: "Send email + SMS to customer on new order" },
                { label: "Order Shipped", desc: "Notify customer with tracking number" },
                { label: "Out for Delivery", desc: "SMS notification before delivery" },
                { label: "Order Delivered", desc: "Delivery confirmation to customer" },
                { label: "Low Stock Alert", desc: "Email admin when stock falls below 10" },
                { label: "New Customer Registration", desc: "Welcome email to new customers" },
                { label: "Price Drop on Wishlist", desc: "Notify customer of price reduction" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-amber-600 peer-focus:ring-2 peer-focus:ring-amber-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              <Save size={15} /> Save Changes
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium animate-pulse">✅ Settings saved!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
