"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import api, { type PostSummary, type Category } from "@/lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";

interface Props {
  post?: PostSummary;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export default function PostEditor({ post, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || "");
  const [categoryId, setCategoryId] = useState<number | "">(post?.category?.id || "");
  const [isPublished, setIsPublished] = useState(post?.is_published || false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: "",
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<{ url: string }>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImageUrl(data.url);
      toast.success("Upload thành công");
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    setSaving(true);
    try {
      const payload = {
        title,
        content: editor?.getHTML() || "",
        excerpt: excerpt || undefined,
        cover_image_url: coverImageUrl || undefined,
        category_id: categoryId || undefined,
        is_published: isPublished,
      };
      if (post) {
        await api.put(`/posts/${post.id}`, payload);
        toast.success("Đã cập nhật bài viết");
      } else {
        await api.post("/posts", payload);
        toast.success("Đã tạo bài viết");
      }
      onSave();
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <h1 className="text-xl font-semibold text-stone-800">{post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">
          <Save className="w-4 h-4" />
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài viết..."
              className="w-full text-2xl font-display font-semibold text-stone-800 placeholder-stone-300 border-none outline-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-100 px-4 py-2 flex flex-wrap gap-1">
              {[
                { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
                { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
                { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
                { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
                { label: "UL", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${btn.active ? "bg-brand-100 text-brand-700" : "text-stone-500 hover:bg-gray-100"}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-medium text-stone-700 mb-3">Xuất bản</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
              />
              <span className="text-sm text-stone-600">Đăng công khai</span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-medium text-stone-700 mb-3">Danh mục</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              <option value="">Không có danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-medium text-stone-700 mb-3">Ảnh bìa</h3>
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Cover" className="w-full rounded-lg mb-3 aspect-video object-cover" />
            )}
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="URL ảnh..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <label className="btn-outline text-sm py-1.5 w-full justify-center cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Đang upload..." : "Upload ảnh"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-medium text-stone-700 mb-3">Tóm tắt</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn về bài viết..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
