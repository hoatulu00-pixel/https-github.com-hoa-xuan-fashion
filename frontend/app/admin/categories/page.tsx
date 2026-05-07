"use client";

import { useEffect, useState } from "react";
import api, { type Category } from "@/lib/api";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  async function load() {
    const { data } = await api.get<Category[]>("/categories");
    setCategories(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await api.post("/categories", { name: newName, description: newDesc });
    toast.success("Đã tạo danh mục");
    setNewName(""); setNewDesc("");
    load();
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    await api.put(`/categories/${id}`, { name: editName });
    toast.success("Đã cập nhật");
    setEditId(null);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa danh mục này?")) return;
    await api.delete(`/categories/${id}`);
    toast.success("Đã xóa");
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Danh mục</h1>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="font-medium text-stone-700 mb-3">Tạo danh mục mới</h2>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên danh mục..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Mô tả (tùy chọn)..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button onClick={handleCreate} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Tạo
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-stone-400 text-center py-12">Chưa có danh mục nào</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-stone-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tên</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Mô tả</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {editId === cat.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-brand-300 rounded px-2 py-1 text-sm focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-stone-800">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-400 hidden md:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{cat.description || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {editId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-green-500 hover:text-green-600">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1.5 text-stone-400 hover:text-stone-600">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="p-1.5 text-stone-400 hover:text-brand-500">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-stone-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
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
