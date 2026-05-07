"use client";

import { useEffect, useState } from "react";
import api, { type Product, type Category } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null | "new">(null);

  async function load() {
    const [p, c] = await Promise.all([
      api.get<Product[]>("/products?limit=50"),
      api.get<Category[]>("/categories"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
  }

  useEffect(() => { load(); }, []);

  async function deleteProduct(id: number) {
    if (!confirm("Xóa sản phẩm này?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Đã xóa sản phẩm");
    load();
  }

  function formatPrice(n: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
  }

  if (editing !== null) {
    return (
      <ProductForm
        product={editing === "new" ? undefined : editing}
        categories={categories}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Sản phẩm</h1>
        <button onClick={() => setEditing("new")} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <p className="text-stone-400 text-center py-12">Chưa có sản phẩm nào</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-stone-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Giá</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-800 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{formatPrice(Number(p.price))}</td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">Hoạt động</span>}
                      {p.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">Nổi bật</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditing(p)} className="p-1.5 text-stone-400 hover:text-brand-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
