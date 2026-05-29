"use client";

import { useState, useRef } from "react";
import { products as initialProducts } from "@/lib/data";
import { categories } from "@/lib/data";
import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, Eye, Filter, Download, X, Upload } from "lucide-react";

const emptyProduct: Omit<Product, "id"> = {
  name: "", brand: "", category: "office-chairs", description: "", material: "",
  frameMaterial: "", seatHeight: "", weightCapacity: "", armrest: "", headrest: "",
  recline: "", warranty: "", assemblyRequired: false, colors: [], dimensions: "",
  weight: "", mrp: 0, sellingPrice: 0, gstPercent: 18, stockQty: 0, sku: "",
  images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600"],
  isFeatured: false, rating: 0, reviewCount: 0, tags: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPreview, setImportPreview] = useState<string[][]>([]);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add/Edit form state
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "active" ? p.stockQty > 10 :
      statusFilter === "low" ? p.stockQty > 0 && p.stockQty <= 10 :
      statusFilter === "out" ? p.stockQty === 0 : true;
    return matchSearch && matchStatus;
  });

  // Save add
  const handleAdd = () => {
    if (!form.name || !form.sku || !form.brand) { setFormError("Name, SKU, and Brand are required."); return; }
    const newP: Product = { ...form, id: "p" + Date.now(), mrp: Number(form.mrp), sellingPrice: Number(form.sellingPrice), stockQty: Number(form.stockQty) };
    setProducts(prev => [newP, ...prev]);
    setShowAddModal(false);
    setForm(emptyProduct);
    setFormError("");
    showToast("✅ Product added successfully!");
  };

  // Save edit
  const handleEdit = () => {
    if (!editProduct) return;
    if (!editProduct.name || !editProduct.sku || !editProduct.brand) { setFormError("Name, SKU, and Brand are required."); return; }
    setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...editProduct, mrp: Number(editProduct.mrp), sellingPrice: Number(editProduct.sellingPrice), stockQty: Number(editProduct.stockQty) } : p));
    setEditProduct(null);
    setFormError("");
    showToast("✅ Product updated successfully!");
  };

  // Confirm delete
  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    setDeleteProduct(null);
    showToast("🗑️ Product deleted.");
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    const headers = ["name","brand","sku","category","material","frameMaterial","seatHeight","weightCapacity","armrest","headrest","recline","warranty","assemblyRequired","colors","dimensions","weight","mrp","sellingPrice","gstPercent","stockQty","image","isFeatured","description","tags"];
    const sampleRow = ["ErgoMax Pro Chair","Green Soul","GS-EM-001","office-chairs","Mesh","Steel","45cm - 55cm","120 kg","Adjustable","Yes","Yes (90-135 degrees)","2 Years","false","Black|Grey","65cm x 65cm x 120cm","12 kg","18999","12999","18","45","https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600","true","Premium ergonomic mesh chair","ergonomic|mesh|office"];
    const csvContent = [headers, sampleRow].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = text.trim().split("\n").map(r => r.split(",").map(c => c.replace(/^"|"$/g, "").trim()));
      if (rows.length < 2) { setImportError("CSV must have at least a header row and one data row."); return; }
      setImportPreview(rows.slice(0, 6));
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    if (!fileInputRef.current?.files?.[0]) return;
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = text.trim().split("\n");
      const headers = rows[0].split(",").map(h => h.replace(/^"|"$/g, "").trim().toLowerCase());
      const imported: Product[] = rows.slice(1).map((row, i) => {
        const cols = row.split(",").map(c => c.replace(/^"|"$/g, "").trim());
        const get = (key: string) => cols[headers.indexOf(key)] || "";
        return {
          id: "imp_" + Date.now() + "_" + i,
          name: get("name") || "Imported Chair",
          brand: get("brand") || "Unknown",
          category: get("category") || "office-chairs",
          description: get("description") || "",
          material: get("material") || "",
          frameMaterial: get("framematerial") || "",
          seatHeight: get("seatheight") || "",
          weightCapacity: get("weightcapacity") || "",
          armrest: get("armrest") || "",
          headrest: get("headrest") || "",
          recline: get("recline") || "",
          warranty: get("warranty") || "",
          assemblyRequired: get("assemblyrequired") === "true",
          colors: (get("colors") || "").split("|").filter(Boolean),
          dimensions: get("dimensions") || "",
          weight: get("weight") || "",
          mrp: parseFloat(get("mrp")) || 0,
          sellingPrice: parseFloat(get("sellingprice")) || 0,
          gstPercent: parseFloat(get("gstpercent")) || 18,
          stockQty: parseInt(get("stockqty")) || 0,
          sku: get("sku") || "SKU_" + i,
          images: [get("image") || "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600"],
          isFeatured: get("isfeatured") === "true",
          rating: parseFloat(get("rating")) || 0,
          reviewCount: parseInt(get("reviewcount")) || 0,
          tags: (get("tags") || "").split("|").filter(Boolean),
        };
      });
      setProducts(prev => [...imported, ...prev]);
      setShowImportModal(false);
      setImportPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast(`✅ ${imported.length} products imported!`);
    };
    reader.readAsText(file);
  };

  const ProductForm = ({ data, onChange }: { data: any; onChange: (key: string, val: any) => void }) => (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {[["name","Name*"],["brand","Brand*"],["sku","SKU*"],["material","Material"],["frameMaterial","Frame Material"],["seatHeight","Seat Height"],["weightCapacity","Weight Capacity"],["armrest","Armrest"],["headrest","Headrest"],["recline","Recline"],["warranty","Warranty"],["dimensions","Dimensions"],["weight","Weight (kg)"]].map(([key, label]) => (
        <div key={key}>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input value={data[key] || ""} onChange={e => onChange(key, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
        </div>
      ))}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Category</label>
        <select value={data.category || ""} onChange={e => onChange("category", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">GST %</label>
        <input type="number" value={data.gstPercent || 18} onChange={e => onChange("gstPercent", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">MRP (₹)</label>
        <input type="number" value={data.mrp || ""} onChange={e => onChange("mrp", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Selling Price (₹)</label>
        <input type="number" value={data.sellingPrice || ""} onChange={e => onChange("sellingPrice", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Stock Qty</label>
        <input type="number" value={data.stockQty || ""} onChange={e => onChange("stockQty", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
        <input value={(data.images || [])[0] || ""} onChange={e => onChange("images", [e.target.value])} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <textarea value={data.description || ""} onChange={e => onChange("description", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none" />
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <input type="checkbox" id="featured" checked={!!data.isFeatured} onChange={e => onChange("isFeatured", e.target.checked)} className="accent-amber-600" />
        <label htmlFor="featured" className="text-sm text-gray-600">Mark as Featured</label>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400">{products.length} chairs listed</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowImportModal(true); setImportPreview([]); setImportError(""); }}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Upload size={15} /> Import CSV
          </button>
          <button
            onClick={() => { setForm(emptyProduct); setFormError(""); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={15} /> Add Chair
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-amber-400">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search by name, brand, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 w-8"><input type="checkbox" className="accent-amber-600" /></th>
                {["Product","Brand","Category","Price","Stock","Rating","Featured","Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const discount = getDiscount(p.mrp, p.sellingPrice);
                return (
                  <tr key={p.id} className="hover:bg-amber-50/50 transition-colors group">
                    <td className="px-4 py-3.5"><input type="checkbox" className="accent-amber-600" /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-800 line-clamp-1 max-w-[180px]">{p.name}</div>
                          <div className="text-xs text-gray-400">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{p.brand}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap capitalize text-xs">{p.category.replace(/-/g," ")}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{formatPrice(p.sellingPrice)}</div>
                      {discount > 0 && <div className="text-xs text-green-600">{discount}% off MRP</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stockQty === 0 ? "bg-red-100 text-red-700" : p.stockQty <= 10 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {p.stockQty === 0 ? "Out of Stock" : `${p.stockQty} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">⭐ {p.rating} ({p.reviewCount})</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.isFeatured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewProduct(p)} className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} /></button>
                        <button onClick={() => { setEditProduct({ ...p }); setFormError(""); }} className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteProduct(p)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Add New Chair</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
              <ProductForm data={form} onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Add Product</button>
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
              <ProductForm data={editProduct} onChange={(k, v) => setEditProduct(prev => prev ? { ...prev, [k]: v } : prev)} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setEditProduct(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 text-white rounded-xl">Save Changes</button>
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
              <img src={viewProduct.images[0]} alt="" className="w-full h-48 object-cover rounded-xl" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{viewProduct.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{viewProduct.brand} · SKU: {viewProduct.sku}</p>
              </div>
              <p className="text-sm text-gray-600">{viewProduct.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Category", viewProduct.category.replace(/-/g," ")],
                  ["MRP", formatPrice(viewProduct.mrp)],
                  ["Selling Price", formatPrice(viewProduct.sellingPrice)],
                  ["Stock", `${viewProduct.stockQty} units`],
                  ["Material", viewProduct.material],
                  ["Frame", viewProduct.frameMaterial],
                  ["Seat Height", viewProduct.seatHeight],
                  ["Capacity", viewProduct.weightCapacity],
                  ["Armrest", viewProduct.armrest],
                  ["Headrest", viewProduct.headrest],
                  ["Recline", viewProduct.recline],
                  ["Warranty", viewProduct.warranty],
                  ["Dimensions", viewProduct.dimensions],
                  ["Weight", viewProduct.weight],
                  ["Rating", `⭐ ${viewProduct.rating} (${viewProduct.reviewCount} reviews)`],
                  ["Featured", viewProduct.isFeatured ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="font-medium text-gray-800 capitalize text-sm mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete Product?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteProduct.name}" will be permanently removed.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteProduct(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-900">Import Products via CSV</h2>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-500">CSV headers: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">name, brand, sku, category, mrp, sellingPrice, stockQty...</code></p>
                <button onClick={handleDownloadTemplate} className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
                  <Download size={13} /> Download Template
                </button>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-amber-400 transition-colors">
                <Upload size={28} className="text-gray-300 mb-2" />
                <span className="text-sm text-gray-500">Click to select CSV file</span>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
              </label>
              {importError && <p className="text-red-500 text-sm">{importError}</p>}
              {importPreview.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{importPreview[0].map((h, i) => <th key={i} className="px-3 py-2 text-left text-gray-500">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(1).map((row, i) => (
                        <tr key={i} className="border-t border-gray-50">
                          {row.map((cell, j) => <td key={j} className="px-3 py-1.5 text-gray-700 truncate max-w-[80px]">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-400 px-3 py-2">Preview of first 5 rows</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleImportConfirm} disabled={importPreview.length === 0} className="px-4 py-2 text-sm bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl">Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
