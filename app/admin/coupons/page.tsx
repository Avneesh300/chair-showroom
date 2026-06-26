"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { getCouponsApi, saveCouponApi, deleteCouponApi } from "@/services/coupon.service";
import Pagination from "@/components/common/Pagination";
import { getCategoriesApi } from "@/services/category.service";
import { getProductsApi } from "@/services/product.service";

const emptyCoupon = {
  code: "",
  minimumOrder: "",
  discountType: "percentage",
  discountValue: "",
  validFrom: "",
  validUntil: "",
 applicableProducts: "",   
  applicableCategories: "", 
};

const CouponForm = ({
  data,
  onChange,
  categories,
  products,
}: {
  data: any;
  onChange: (k: string, v: any) => void;
  categories: any[];
  products: any[];
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
    <div>
      <label className="block text-xs text-gray-500 mb-1">Coupon Code*</label>
      <input
        value={data.code || ""}
        onChange={e => onChange("code", e.target.value.toUpperCase())}
        placeholder="e.g. SUMMER20"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Minimum Order (₹)</label>
      <input
        type="number"
        value={data.minimumOrder || ""}
        onChange={e => onChange("minimumOrder", e.target.value)}
        placeholder="e.g. 5000"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Discount Type*</label>
      <select
        value={data.discountType || "percentage"}
        onChange={e => onChange("discountType", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      >
        <option value="percentage">Percentage (%)</option>
        <option value="flat">Flat Amount (₹)</option>
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Discount Value*</label>
      <input
        type="number"
        value={data.discountValue || ""}
        onChange={e => onChange("discountValue", e.target.value)}
        placeholder={data.discountType === "percentage" ? "e.g. 10" : "e.g. 500"}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Valid From*</label>
      <input
        type="date"
        value={data.validFrom ? data.validFrom.split("T")[0] : ""}
        onChange={e => onChange("validFrom", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Valid Until*</label>
      <input
        type="date"
        value={data.validUntil ? data.validUntil.split("T")[0] : ""}
        onChange={e => onChange("validUntil", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>

    {/* Categories - Single Select */}
    <div>
      <label className="block text-xs text-gray-500 mb-1">Applicable Category</label>
      <select
        value={data.applicableCategories || ""}
        onChange={e => onChange("applicableCategories", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      >
        <option value="">Select Category</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>

    {/* Products - Single Select */}
    <div>
      <label className="block text-xs text-gray-500 mb-1">Applicable Product</label>
      <select
        value={data.applicableProducts || ""}
        onChange={e => onChange("applicableProducts", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      >
        <option value="">Select Product</option>
        {products.map((p: any) => (
          <option key={p.id} value={p.id}>{p.product_name} ({p.sku})</option>
        ))}
      </select>
    </div>
  </div>
);

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewCoupon, setViewCoupon] = useState<any | null>(null);
  const [editCoupon, setEditCoupon] = useState<any | null>(null);
  const [deleteCoupon, setDeleteCoupon] = useState<any | null>(null);
  const [form, setForm] = useState(emptyCoupon);
  const [formError, setFormError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);


  const fetchDropdowns = async () => {
    const [catRes, prodRes]: any[] = await Promise.all([
      getCategoriesApi({ page: 1, limit: 100, search: "" }),
      getProductsApi({ page: 1, limit: 100, search: "" }),
    ]);
    if (catRes?.success) setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name })));
    if (prodRes?.success) setProducts(prodRes.data);
  };

  useEffect(() => {
    fetchCoupons();
    fetchDropdowns(); // ✅ add karo
  }, []);

  const fetchCoupons = async (page = 1) => {
    setLoading(true);
    const response: any = await getCouponsApi({ page, limit: 10, search: "" });
    if (response?.success) {
      setCoupons(response.data);
      const pagination = response.data?.[0]?.paginations;
      setTotalPages(pagination?.totalPages || 1);
      setCurrentPage(pagination?.currentPage || page);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async () => {
    if (!form.code || !form.discountType || !form.discountValue || !form.validFrom || !form.validUntil) {
      setFormError("Please fill all required fields.");
      return;
    }
    const response: any = await saveCouponApi(form);
    if (response?.success) {
      setShowAddModal(false);
      toast.success(response.message);
      setForm(emptyCoupon);
      fetchCoupons(currentPage);
    }
  };

  const handleEdit = async () => {
    if (!editCoupon) return;
    const response: any = await saveCouponApi(editCoupon);
    if (response?.success) {
      toast.success(response.message);
      setEditCoupon(null);
      fetchCoupons(currentPage);
    }
  };

  const handleDelete = async () => {
    if (!deleteCoupon) return;
    const response: any = await deleteCouponApi({
      id: deleteCoupon.id,
      status: deleteCoupon.status == 1 ? "A" : "B",
    });
    if (response?.success) {
      setDeleteCoupon(null);
      toast.success(response.message);
      fetchCoupons(currentPage);
    }
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
  const isExpired = (d: string) => d ? new Date(d) < new Date() : false;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-400">{coupons.length} coupons</p>
        </div>
        <button onClick={() => { setForm(emptyCoupon); setFormError(""); setShowAddModal(true); }} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-gray-400 col-span-3 text-center py-10">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-gray-400 col-span-3 text-center py-10">No coupons found</p>
        ) : coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-x-4 -translate-y-8 opacity-50" />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag size={16} className="text-amber-700" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900 font-mono tracking-wider">{coupon.code}</div>
                  <div className="text-xs text-gray-400">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isExpired(coupon.validUntil) ? "bg-red-100 text-red-600" : coupon.status === "1" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {isExpired(coupon.validUntil) ? "Expired" : coupon.status === "1" ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-1 text-xs text-gray-500 mb-4">
              {coupon.minimumOrder > 0 && <div>Min order: <span className="font-medium text-gray-700">₹{coupon.minimumOrder}</span></div>}
              <div>Valid: <span className="font-medium text-gray-700">{formatDate(coupon.validFrom)} – {formatDate(coupon.validUntil)}</span></div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setViewCoupon(coupon)} className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-blue-500 hover:bg-blue-50">
                <Eye size={12} /> View
              </button>
              <button onClick={() => { setEditCoupon({ ...coupon }); setFormError(""); }} className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50">
                <Edit2 size={12} /> Edit
              </button>
              <button onClick={() => setDeleteCoupon(coupon)} className="flex items-center gap-1.5 text-xs border border-red-200 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={(page) => fetchCoupons(page)} />
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Create Coupon</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <CouponForm data={form} onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))} categories={categories}
                products={products} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editCoupon && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Edit Coupon</h2>
              <button onClick={() => setEditCoupon(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <CouponForm data={editCoupon} onChange={(k, v) => setEditCoupon((prev: any) => prev ? { ...prev, [k]: v } : prev)} categories={categories}
                products={products} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditCoupon(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewCoupon && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Coupon Details</h2>
              <button onClick={() => setViewCoupon(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ["Code", viewCoupon.code],
                ["Discount", viewCoupon.discountType === "percentage" ? `${viewCoupon.discountValue}%` : `₹${viewCoupon.discountValue}`],
                ["Discount Type", viewCoupon.discountType],
                ["Min Order", viewCoupon.minimumOrder ? `₹${viewCoupon.minimumOrder}` : "No minimum"],
                ["Valid From", formatDate(viewCoupon.validFrom)],
                ["Valid Until", formatDate(viewCoupon.validUntil)],
                ["Status", isExpired(viewCoupon.validUntil) ? "Expired" : viewCoupon.status === "1" ? "Active" : "Inactive"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewCoupon(null)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteCoupon && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 size={22} className="text-red-600" /></div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete Coupon?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteCoupon.code}" will be permanently removed.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteCoupon(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}