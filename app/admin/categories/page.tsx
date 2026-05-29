"use client";

import { useState } from "react";
import { categories as initialCategories } from "@/lib/data";
import { Category } from "@/types";
import { Plus, Edit2, Trash2, GripVertical, Eye, X } from "lucide-react";

const emptyCategory: Omit<Category, "id"> = { name: "", slug: "", icon: "🪑", productCount: 0, image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewCat, setViewCat] = useState<Category | null>(null);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [form, setForm] = useState<Omit<Category, "id">>(emptyCategory);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleAdd = () => {
    if (!form.name || !form.slug) { setFormError("Name and Slug are required."); return; }
    const newCat: Category = { ...form, id: "cat_" + Date.now() };
    setCategories(prev => [...prev, newCat]);
    setShowAddModal(false);
    setForm(emptyCategory);
    setFormError("");
    showToast("✅ Category added!");
  };

  const handleEdit = () => {
    if (!editCat) return;
    if (!editCat.name || !editCat.slug) { setFormError("Name and Slug are required."); return; }
    setCategories(prev => prev.map(c => c.id === editCat.id ? editCat : c));
    setEditCat(null);
    setFormError("");
    showToast("✅ Category updated!");
  };

  const handleDelete = () => {
    if (!deleteCat) return;
    setCategories(prev => prev.filter(c => c.id !== deleteCat.id));
    setDeleteCat(null);
    showToast("🗑️ Category deleted.");
  };

  const CategoryForm = ({ data, onChange }: { data: any; onChange: (k: string, v: any) => void }) => (
    <div className="space-y-3 text-sm">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Name*</label>
        <input value={data.name || ""} onChange={e => onChange("name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Slug* (e.g. office-chairs)</label>
        <input value={data.slug || ""} onChange={e => onChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 font-mono" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Icon (emoji)</label>
        <input value={data.icon || ""} onChange={e => onChange("icon", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Product Count</label>
        <input type="number" value={data.productCount || 0} onChange={e => onChange("productCount", parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
        <input value={data.image || ""} onChange={e => onChange("image", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">{toast}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-400">{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(emptyCategory); setFormError(""); setShowAddModal(true); }} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 text-xs font-semibold text-gray-500 grid grid-cols-12 gap-3">
          <span className="col-span-1" />
          <span className="col-span-1">Icon</span>
          <span className="col-span-3">Name</span>
          <span className="col-span-2">Slug</span>
          <span className="col-span-2">Products</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-2">Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-amber-50/50 transition-colors group">
              <div className="col-span-1 text-gray-300 cursor-grab"><GripVertical size={16} /></div>
              <div className="col-span-1 text-2xl">{cat.icon}</div>
              <div className="col-span-3 font-medium text-gray-800 text-sm">{cat.name}</div>
              <div className="col-span-2 text-xs text-gray-400 font-mono">{cat.slug}</div>
              <div className="col-span-2 text-sm text-gray-600">{cat.productCount} items</div>
              <div className="col-span-1">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <button onClick={() => setViewCat(cat)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={13} /></button>
                <button onClick={() => { setEditCat({ ...cat }); setFormError(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded-lg" title="Edit"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteCat(cat)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Add Category</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <CategoryForm data={form} onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editCat && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Edit Category</h2>
              <button onClick={() => setEditCat(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <CategoryForm data={editCat} onChange={(k, v) => setEditCat(prev => prev ? { ...prev, [k]: v } : prev)} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditCat(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewCat && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Category Details</h2>
              <button onClick={() => setViewCat(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {viewCat.image && <img src={viewCat.image} alt="" className="w-full h-36 object-cover rounded-xl" />}
              <div className="text-5xl text-center">{viewCat.icon}</div>
              <div className="space-y-2">
                {[["Name", viewCat.name], ["Slug", viewCat.slug], ["Products", `${viewCat.productCount} items`], ["Status", "Active"]].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewCat(null)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteCat && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 size={22} className="text-red-600" /></div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete Category?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteCat.name}" will be permanently removed.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteCat(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
