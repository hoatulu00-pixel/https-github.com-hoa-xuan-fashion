"use client";

import { useEffect, useState } from "react";
import api, { type PostSummary, type Category } from "@/lib/api";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import PostEditor from "@/components/admin/PostEditor";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<PostSummary | null | "new">(null);

  async function load() {
    const [p, c] = await Promise.all([
      api.get<PostSummary[]>("/posts/admin?limit=50"),
      api.get<Category[]>("/categories"),
    ]);
    setPosts(p.data);
    setCategories(c.data);
  }

  useEffect(() => { load(); }, []);

  async function deletePost(id: number) {
    if (!confirm("Xóa bài viết này?")) return;
    await api.delete(`/posts/${id}`);
    toast.success("Đã xóa bài viết");
    load();
  }

  if (editing !== null) {
    return (
      <PostEditor
        post={editing === "new" ? undefined : editing}
        categories={categories}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Bài viết</h1>
        <button onClick={() => setEditing("new")} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> Tạo mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-stone-400 text-center py-12">Chưa có bài viết nào</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-stone-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Ngày tạo</th>
                <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-800 max-w-xs truncate">{p.title}</td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-stone-400 hidden md:table-cell">
                    {format(new Date(p.created_at), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${p.is_published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_published ? <><Eye className="w-3 h-3" /> Đăng</> : <><EyeOff className="w-3 h-3" /> Ẩn</>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditing(p)} className="p-1.5 text-stone-400 hover:text-brand-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePost(p.id)} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors">
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
