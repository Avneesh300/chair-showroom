"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X, Upload, Download } from "lucide-react";
import { toast } from "react-toastify";
import { getProductsApi, saveProductApi, deleteProductApi } from "@/services/product.service";
import { getCategoriesApi } from "@/services/category.service";
import { getBrandsApi } from "@/services/brand.service";
import Pagination from "@/components/common/Pagination";

const emptyProduct = {
  category: "",
  brand: "",
  product_name: "",
  description: "",
  color_name: "",
  color_code: "#000000",
  sku: "",
  material: "",
  frameMaterial: "",
  seatHeight: "",
  weightCapacity: "",
  armrest: "",
  headrest: "",
  recline: "",
  warranty: "",
  dimensions: "",
  mrp: "",
  sellingPrice: "",
  stock: "",
  slug: "",
  product_image: null as File | null,
};

const ProductForm = ({
  data,
  onChange,
  categories,
  brands,
  isEdit,
}: {
  data: any;
  onChange: (k: string, v: any) => void;
  categories: any[];
  brands: any[];
  isEdit?: boolean;
}) => (
  <div className="grid grid-cols-2 gap-3 text-sm">
    <div>
      <label className="block text-xs text-gray-500 mb-1">Product Name*</label>
      <input value={data.product_name || ""} onChange={e => onChange("product_name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">SKU*</label>
      <input value={data.sku || ""} onChange={e => onChange("sku", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Category*</label>
      <select value={data.category || ""} onChange={e => onChange("category", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400">
        <option value="">Select Category</option>
        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Brand*</label>
      <select value={data.brand || ""} onChange={e => onChange("brand", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400">
        <option value="">Select Brand</option>
        {brands.map((b: any) => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Color Name*</label>
      <input value={data.color_name || ""} onChange={e => onChange("color_name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Color Code*</label>
      <div className="flex gap-2 items-center border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-amber-400">
        <input type="color" value={data.color_code || "#000000"} onChange={e => onChange("color_code", e.target.value)} className="w-8 h-7 cursor-pointer border-none outline-none bg-transparent" />
        <input value={data.color_code || ""} onChange={e => onChange("color_code", e.target.value)} className="flex-1 outline-none text-sm" placeholder="#000000" />
      </div>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Slug*</label>
      <input value={data.slug || ""} onChange={e => onChange("slug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Material</label>
      <input value={data.material || ""} onChange={e => onChange("material", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Frame Material</label>
      <input value={data.frameMaterial || ""} onChange={e => onChange("frameMaterial", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Seat Height</label>
      <input value={data.seatHeight || ""} onChange={e => onChange("seatHeight", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Weight Capacity</label>
      <input value={data.weightCapacity || ""} onChange={e => onChange("weightCapacity", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Armrest</label>
      <input value={data.armrest || ""} onChange={e => onChange("armrest", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Headrest</label>
      <input value={data.headrest || ""} onChange={e => onChange("headrest", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Recline</label>
      <input value={data.recline || ""} onChange={e => onChange("recline", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Warranty</label>
      <input value={data.warranty || ""} onChange={e => onChange("warranty", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Dimensions</label>
      <input value={data.dimensions || ""} onChange={e => onChange("dimensions", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">MRP (₹)*</label>
      <input type="number" value={data.mrp || ""} onChange={e => onChange("mrp", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Selling Price (₹)*</label>
      <input type="number" value={data.sellingPrice || ""} onChange={e => onChange("sellingPrice", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Stock*</label>
      <input type="number" value={data.stock || ""} onChange={e => onChange("stock", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" />
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">
        Product Image{isEdit ? " (optional)" : "*"}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={e => onChange("product_image", e.target.files?.[0] || null)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 text-xs"
      />
    </div>
    <div className="col-span-2">
      <label className="block text-xs text-gray-500 mb-1">Description</label>
      <textarea value={data.description || ""} onChange={e => onChange("description", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 resize-none" />
    </div>
  </div>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null);
  const [form, setForm] = useState<any>(emptyProduct);
  const [formError, setFormError] = useState("");

  const fetchProducts = async (page = 1, searchVal = search) => {
    setLoading(true);
    const response: any = await getProductsApi({ page, limit: 10, search: searchVal });
    if (response?.success) {
      setProducts(response.data);
      const pagination = response.data?.[0]?.paginations;
      setTotalPages(pagination?.totalPages || 1);
      setCurrentPage(pagination?.currentPage || page);
    }
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const [catRes, brandRes]: any[] = await Promise.all([
      getCategoriesApi({ page: 1, limit: 100, search: "" }),
      getBrandsApi({ page: 1, limit: 100, search: "" }),
    ]);
    if (catRes?.success) setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name })));
    if (brandRes?.success) setBrands(brandRes.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchDropdowns();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1, search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const buildFormData = (data: any): FormData => {
    const fd = new FormData();
    const fields = [
      "id", "category", "brand", "product_name", "description",
      "color_name", "color_code", "sku", "material", "frameMaterial",
      "seatHeight", "weightCapacity", "armrest", "headrest", "recline",
      "warranty", "dimensions", "mrp", "sellingPrice", "stock", "slug",
    ];
    fields.forEach(key => { if (data[key] !== undefined && data[key] !== null && data[key] !== "") fd.append(key, data[key]); });
    if (data.product_image instanceof File) fd.append("product_image", data.product_image);
    return fd;
  };

  const handleAdd = async () => {
    if (!form.product_name || !form.sku || !form.category || !form.brand || !form.color_name || !form.color_code || !form.slug) {
      setFormError("Please fill all required fields.");
      return;
    }
    const fd = buildFormData(form);
    const response: any = await saveProductApi(fd);
    if (response?.success) {
      setShowAddModal(false);
      toast.success(response.message);
      setForm(emptyProduct);
      fetchProducts(currentPage);
    }
  };

  const handleEdit = async () => {
    if (!editProduct) return;
    const fd = buildFormData(editProduct);
    const response: any = await saveProductApi(fd);
    if (response?.success) {
      toast.success(response.message);
      setEditProduct(null);
      fetchProducts(currentPage);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    const response: any = await deleteProductApi({
      id: deleteProduct.id,
      status: deleteProduct.status == 1 ? "A" : "B",
    });
    if (response?.success) {
      setDeleteProduct(null);
      toast.success(response.message);
      fetchProducts(currentPage);
    }
  };

  const formatPrice = (v: number) => v ? `₹${Number(v).toLocaleString("en-IN")}` : "-";
  const getDiscount = (mrp: number, sp: number) => mrp && sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400">{products.length} products</p>
        </div>
        <button onClick={() => { setForm(emptyProduct); setFormError(""); setShowAddModal(true); }} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 focus-within:border-amber-400">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search by name, SKU..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Product", "Brand", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No products found</td></tr>
              ) : products.map((p) => {
                const discount = getDiscount(p.mrp, p.sellingPrice);
                return (
                  <tr key={p.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.product_image
                          ? <img src={p.product_image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                          : <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                        }
                        <div>
                          <div className="font-medium text-gray-800 line-clamp-1 max-w-[180px]">{p.product_name}</div>
                          <div className="text-xs text-gray-400">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{p.brand?.brand_name || "-"}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap text-xs">{p.category?.category_name || "-"}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{formatPrice(p.sellingPrice)}</div>
                      {discount > 0 && <div className="text-xs text-green-600">{discount}% off</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock == 0 ? "bg-red-100 text-red-700" : p.stock <= 10 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {p.stock == 0 ? "Out of Stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "1" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewProduct(p)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={13} /></button>
                        <button onClick={() => { setEditProduct({ ...p, category: p.category?.id || "", brand: p.brand?.id || "", product_image: null }); setFormError(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded-lg"><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteProduct(p)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={(page) => fetchProducts(page)} />
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Add Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <ProductForm data={form} onChange={(k, v) => setForm((prev: any) => ({ ...prev, [k]: v }))} categories={categories} brands={brands} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Edit Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <ProductForm data={editProduct} onChange={(k, v) => setEditProduct((prev: any) => prev ? { ...prev, [k]: v } : prev)} categories={categories} brands={brands} isEdit />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-serif text-lg font-bold text-gray-900">Product Details</h2>
              <button onClick={() => setViewProduct(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {viewProduct.product_image && <img src={viewProduct.product_image} alt="" className="w-full h-48 object-cover rounded-xl" />}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{viewProduct.product_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{viewProduct.brand?.brand_name} · SKU: {viewProduct.sku}</p>
              </div>
              {viewProduct.description && <p className="text-sm text-gray-600">{viewProduct.description}</p>}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Category", viewProduct.category?.category_name],
                  ["MRP", formatPrice(viewProduct.mrp)],
                  ["Selling Price", formatPrice(viewProduct.sellingPrice)],
                  ["Stock", `${viewProduct.stock} units`],
                  ["Color", viewProduct.color_name],
                  ["Material", viewProduct.material],
                  ["Frame", viewProduct.frameMaterial],
                  ["Seat Height", viewProduct.seatHeight],
                  ["Capacity", viewProduct.weightCapacity],
                  ["Armrest", viewProduct.armrest],
                  ["Headrest", viewProduct.headrest],
                  ["Recline", viewProduct.recline],
                  ["Warranty", viewProduct.warranty],
                  ["Dimensions", viewProduct.dimensions],
                  ["Status", viewProduct.status === "1" ? "Active" : "Inactive"],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="font-medium text-gray-800 text-sm mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewProduct(null)} className="px-4 py-2 text-sm bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 size={22} className="text-red-600" /></div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete Product?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteProduct.product_name}" will be permanently removed.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteProduct(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}