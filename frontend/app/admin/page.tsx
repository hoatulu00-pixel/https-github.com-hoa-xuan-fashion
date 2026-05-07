"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FileText, ShoppingBag, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, products: 0, categories: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [posts, products, cats] = await Promise.all([
          api.get("/posts/admin?limit=1").catch(() => ({ data: [] })),
          api.get("/products?limit=1").catch(() => ({ data: [] })),
          api.get("/categories").catch(() => ({ data: [] })),
        ]);
        setStats({
          posts: (posts.data as unknown[]).length,
          products: (products.data as unknown[]).length,
          categories: (cats.data as unknown[]).length,
        });
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Bài viết", value: stats.posts, icon: FileText, color: "bg-brand-50 text-brand-600", href: "/admin/posts" },
    { label: "Sản phẩm", value: stats.products, icon: ShoppingBag, color: "bg-rose-50 text-rose-600", href: "/admin/products" },
    { label: "Danh mục", value: stats.categories, icon: Tag, color: "bg-purple-50 text-purple-600", href: "/admin/categories" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="w-5 h-5 text-brand-500" />
        <h1 className="text-xl font-semibold text-stone-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <a key={label} href={href} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{value}+</p>
            <p className="text-stone-500 text-sm mt-0.5">{label}</p>
          </a>
        ))}
      </div>

      <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
        <h2 className="font-display text-lg font-semibold text-stone-800 mb-2">Bắt đầu nhanh</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          <a href="/admin/posts" className="btn-primary text-sm py-2">
            <FileText className="w-4 h-4" /> Tạo bài viết
          </a>
          <a href="/admin/products" className="btn-outline text-sm py-2">
            <ShoppingBag className="w-4 h-4" /> Thêm sản phẩm
          </a>
        </div>
      </div>
    </div>
  );
}
