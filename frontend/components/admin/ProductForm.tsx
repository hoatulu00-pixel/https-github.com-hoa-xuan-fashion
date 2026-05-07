"use client";

import { useState } from "react";
import api, { type Product, type Category } from "@/lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

interface Props {
  product?: Product;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, onSave, onCancel }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discount_price?.toString() || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [categoryId, setCategoryId] = useState<number | "">(product?.category?.id || "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isActive, setIsActive] = useState(product?.is_active !== false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setImages((prev) => [...prev, data.url]);
      toast.success("Upload thành công");
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) { toast.error("Vui lòng nhập tên sản phẩm"); return; }
    if (!price) { toast.error("Vui lòng nhập giá"); return; }
    setSaving(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : undefined,
        images,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        category_id: categoryId || undefined,
        is_featured: isFeatured,
        is_active: isActive,
      };
      if (product) {
        await api.put(`/products/${product.id}`, payload);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.post("/products", payload);
        toast.success("Đã tạo sản phẩm");
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
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <h1 className="text-xl font-semibold text-stone-800">{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">
          <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tên sản phẩm *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mô tả</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Giá (VNĐ) *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Giá sale (VNĐ)</label>
                <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-medium text-stone-700 mb-3">Hình ảnh sản phẩm</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-300 transition-colors">
                <Upload className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">{uploading ? "Uploading..." : "Thêm ảnh"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-medium text-stone-700">Cài đặt</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-brand-500" />
              <span className="text-sm text-stone-600">Hiển thị công khai</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-brand-500" />
              <span className="text-sm text-stone-600">Sản phẩm nổi bật</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <label className="block text-sm font-medium text-stone-700 mb-2">Danh mục</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              <option value="">Không có danh mục</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <label className="block text-sm font-medium text-stone-700 mb-2">Tags (phân cách bằng dấu phẩy)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="áo, váy, mùa hè..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
