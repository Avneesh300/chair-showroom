"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, GripVertical, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { getBrandsApi, saveBrandApi, deleteBrandApi } from "@/services/brand.service";
import Pagination from "@/components/common/Pagination";

const emptyBrand = { brand_name: "" };
const BrandForm = ({ data, onChange }: { data: any; onChange: (k: string, v: any) => void }) => (
  <div className="space-y-3 text-sm">
    <div>
      <label className="block text-xs text-gray-500 mb-1">Brand Name*</label>
      <input
        value={data.brand_name || ""}
        onChange={e => onChange("brand_name", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
      />
    </div>
  </div>
);

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewBrand, setViewBrand] = useState<any | null>(null);
  const [editBrand, setEditBrand] = useState<any | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<any | null>(null);
  const [form, setForm] = useState(emptyBrand);
  const [formError, setFormError] = useState("");

  const fetchBrands = async (page = 1) => {
    setLoading(true);
    const response: any = await getBrandsApi({ page, limit: 10, search: "" });
    if (response?.success) {
      setBrands(response.data);
      const pagination = response.data?.[0]?.paginations;
      setTotalPages(pagination?.totalPages || 1);
      setCurrentPage(pagination?.currentPage || page);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = async () => {
    if (!form.brand_name) { setFormError("Brand Name Required"); return; }
    const fd = new FormData();
    fd.append("brand_name", form.brand_name);
    const response: any = await saveBrandApi(fd);
    if (response?.success) {
      setShowAddModal(false);
      toast.success(response.message);
      setForm(emptyBrand);
      fetchBrands(currentPage);
    }
  };

  const handleEdit = async () => {
    if (!editBrand) return;
    const fd = new FormData();
    fd.append("id", editBrand.id);
    fd.append("brand_name", editBrand.brand_name);
    const response: any = await saveBrandApi(fd);
    if (response?.success) {
      toast.success(response.message);
      setEditBrand(null);
      fetchBrands(currentPage);
    }
  };

  const handleDelete = async () => {
    if (!deleteBrand) return;
    const response: any = await deleteBrandApi({
      id: deleteBrand.id,
      status: deleteBrand.status == 1 ? "A" : "B",
    });
    if (response?.success) {
      setDeleteBrand(null);
      toast.success(response.message);
      fetchBrands(currentPage);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-400">{brands.length} brands</p>
        </div>
        <button onClick={() => { setForm(emptyBrand); setFormError(""); setShowAddModal(true); }} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={15} /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 text-xs font-semibold text-gray-500 grid grid-cols-12 gap-3">
          <span className="col-span-1" />
          <span className="col-span-4">Name</span>
          <span className="col-span-4">Status</span>
          <span className="col-span-3">Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {brands.map((brand) => (
            <div key={brand.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-amber-50/50 transition-colors group">
              <div className="col-span-1 text-gray-300 cursor-grab"><GripVertical size={16} /></div>
              <div className="col-span-4 font-medium text-gray-800 text-sm">{brand.brand_name}</div>
              <div className="col-span-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${brand.status === "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {brand.status === "1" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-1">
                <button onClick={() => setViewBrand(brand)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={13} /></button>
                <button onClick={() => { setEditBrand({ ...brand }); setFormError(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded-lg" title="Edit"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteBrand(brand)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={(page) => fetchBrands(page)} />
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Add Brand</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <BrandForm data={form} onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editBrand && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Edit Brand</h2>
              <button onClick={() => setEditBrand(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <BrandForm data={editBrand} onChange={(k, v) => setEditBrand((prev: any) => prev ? { ...prev, [k]: v } : prev)} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditBrand(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewBrand && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Brand Details</h2>
              <button onClick={() => setViewBrand(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-2">
              {[["Name", viewBrand.brand_name], ["Status", viewBrand.status === "1" ? "Active" : "Inactive"]].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewBrand(null)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteBrand && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 size={22} className="text-red-600" /></div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete Brand?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteBrand.brand_name}" will be permanently removed.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteBrand(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}