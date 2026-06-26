"use client";

import { useState, useEffect } from "react";
import { Save, Store, Truck, CreditCard, Bell, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getSettingsApi, saveSettingsApi } from "@/services/setting.service";

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    // General
    store_name: "",
    contact_email: "",
    contact_phone: "",
    store_address: "",
    gstin: "",
    instagram_url: "",
    facebook_url: "",
    whatsapp_number: "",
    // Shipping
    shipping_rate: 299,
    free_shipping_above: 5000,
    cod_enabled: true,
    delivery_days: "3-5 working days",
    // Payment
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
    // Notifications
    notify_order_placed: true,
    notify_order_shipped: true,
    notify_out_for_delivery: true,
    notify_order_delivered: true,
    notify_low_stock: true,
    notify_new_customer: true,
    notify_price_drop: true,
  });

  // ✅ Settings fetch karo
  useEffect(() => {
    const fetchSettings = async () => {
      const response: any = await getSettingsApi();
      if (response?.success) setForm(response.data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // ✅ Save karo
  const handleSave = async () => {
    setSaving(true);
    const response: any = await saveSettingsApi(form);
    if (response?.success) {
      toast.success("Settings saved successfully!");
    } else {
      toast.error(response?.message || "Save failed");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-amber-600" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">Manage your store configuration</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
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

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-5 max-w-2xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">General Settings</h2>
              {[
                { label: "Store Name", key: "store_name" },
                { label: "Contact Email", key: "contact_email" },
                { label: "Contact Phone", key: "contact_phone" },
                { label: "Store Address", key: "store_address" },
                { label: "GSTIN", key: "gstin" },
                { label: "Instagram URL", key: "instagram_url" },
                { label: "Facebook URL", key: "facebook_url" },
                { label: "WhatsApp Number", key: "whatsapp_number" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={form[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-5 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Shipping Settings</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Flat Shipping Rate (₹)</label>
                <input
                  type="number"
                  value={form.shipping_rate}
                  onChange={(e) => handleChange("shipping_rate", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Free Shipping Above (₹)</label>
                <input
                  type="number"
                  value={form.free_shipping_above}
                  onChange={(e) => handleChange("free_shipping_above", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                <input
                  type="checkbox"
                  checked={form.cod_enabled}
                  onChange={(e) => handleChange("cod_enabled", e.target.checked)}
                  className="accent-amber-600 w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Enable COD (Cash on Delivery)</p>
                  <p className="text-xs text-gray-500">Allow customers to pay at the time of delivery</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated Delivery Days</label>
                <input
                  type="text"
                  value={form.delivery_days}
                  onChange={(e) => handleChange("delivery_days", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-5 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Payment Gateway</h2>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                ⚠️ Payment gateway keys are sensitive. Never share these with anyone.
              </div>
              {[
                { label: "Razorpay Key ID", key: "razorpay_key_id", type: "text" },
                { label: "Razorpay Key Secret", key: "razorpay_key_secret", type: "password" },
                { label: "Razorpay Webhook Secret", key: "razorpay_webhook_secret", type: "password" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Notification Settings</h2>
              {[
                { label: "Order Placed", desc: "Send email + SMS to customer on new order", key: "notify_order_placed" },
                { label: "Order Shipped", desc: "Notify customer with tracking number", key: "notify_order_shipped" },
                { label: "Out for Delivery", desc: "SMS notification before delivery", key: "notify_out_for_delivery" },
                { label: "Order Delivered", desc: "Delivery confirmation to customer", key: "notify_order_delivered" },
                { label: "Low Stock Alert", desc: "Email admin when stock falls below 10", key: "notify_low_stock" },
                { label: "New Customer Registration", desc: "Welcome email to new customers", key: "notify_new_customer" },
                { label: "Price Drop on Wishlist", desc: "Notify customer of price reduction", key: "notify_price_drop" },
              ].map(({ label, desc, key }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-amber-600 peer-focus:ring-2 peer-focus:ring-amber-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}