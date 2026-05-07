import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import ProductCard from "@/components/product/ProductCard";
import type { PostSummary, Product } from "@/lib/api";
import { ArrowRight, Sparkles } from "lucide-react";

async function getFeaturedPosts(): Promise<PostSummary[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/posts?limit=3`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/products?featured=true&limit=4`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [posts, products] = await Promise.all([getFeaturedPosts(), getFeaturedProducts()]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-200/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-brand-600 font-medium text-sm tracking-wide uppercase">
                Phong cách trẻ trung · Năng động
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-6">
              Thời Trang
              <span className="text-brand-500"> Hoa Xuân</span>
            </h1>
            <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-xl">
              Khám phá bộ sưu tập thời trang nữ mang phong cách tươi trẻ, năng động — được thiết kế dành riêng cho phụ nữ hiện đại từ 18 đến 36 tuổi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary shadow-lg shadow-brand-200">
                Xem sản phẩm <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/blog" className="btn-outline">
                Đọc blog
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-200/30 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute right-20 bottom-0 w-64 h-64 bg-rose-200/30 rounded-full translate-y-1/2 blur-2xl" />
      </section>

      {/* Featured Posts */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-500 font-medium text-sm uppercase tracking-wide mb-1">Blog</p>
              <h2 className="section-title">Bài viết nổi bật</h2>
            </div>
            <Link href="/blog" className="text-brand-500 hover:text-brand-600 font-medium text-sm flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "🌸", title: "Phong cách độc đáo", desc: "Thiết kế riêng biệt, không trùng lặp — tôn lên cá tính của bạn." },
              { emoji: "⚡", title: "Cập nhật liên tục", desc: "Bộ sưu tập mới mỗi tuần theo xu hướng thời trang quốc tế." },
              { emoji: "💝", title: "Chất lượng tận tâm", desc: "Chọn lọc kỹ lưỡng từng sản phẩm — đảm bảo thoải mái và bền đẹp." },
            ].map((item) => (
              <div key={item.title} className="p-6">
                <span className="text-4xl">{item.emoji}</span>
                <h3 className="font-display text-xl font-semibold text-stone-800 mt-3 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-500 font-medium text-sm uppercase tracking-wide mb-1">Sản phẩm</p>
              <h2 className="section-title">Bộ sưu tập nổi bật</h2>
            </div>
            <Link href="/products" className="text-brand-500 hover:text-brand-600 font-medium text-sm flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-brand-500 to-rose-500 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Đăng ký nhận tin thời trang
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Nhận ngay những xu hướng mới nhất và ưu đãi độc quyền từ Hoa Xuân.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 px-4 py-3 rounded-full text-stone-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-full hover:bg-brand-50 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
