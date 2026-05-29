"use client";

import { useState } from "react";
import { coupons } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-400">{coupons.length} active coupons</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-800 mb-4">New Coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Coupon Code", placeholder: "e.g. SUMMER20" },
              { label: "Minimum Order (₹)", placeholder: "e.g. 5000" },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                <input placeholder={placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Type</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400">
                <option>Percentage (%)</option>
                <option>Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Value</label>
              <input type="number" placeholder="e.g. 10" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valid From</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valid Until</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Create Coupon
            </button>
            <button onClick={() => setShowForm(false)} className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coupons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-x-4 -translate-y-8 opacity-50" />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Tag size={16} className="text-amber-700" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 font-mono tracking-wider">{coupon.code}</div>
                  <div className="text-xs text-gray-400">
                    {coupon.type === "percent" ? `${coupon.value}% off` : `₹${coupon.value} off`}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Min order: {formatPrice(coupon.minOrderValue)}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                <Edit2 size={12} /> Edit
              </button>
              <button className="flex items-center gap-1.5 text-xs border border-red-200 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
