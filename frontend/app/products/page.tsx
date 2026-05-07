import ProductCard from "@/components/product/ProductCard";
import type { Product, Category } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getProducts(category?: string): Promise<Product[]> {
  const params = new URLSearchParams({ limit: "20" });
  if (category) params.set("category", category);
  try {
    const res = await fetch(`${API}/products?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Sản phẩm",
  description: "Bộ sưu tập thời trang nữ phong cách trẻ trung từ Hoa Xuân Fashion",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-brand-500 font-medium text-sm uppercase tracking-wide mb-2">Bộ sưu tập</p>
        <h1 className="section-title text-4xl md:text-5xl mb-4">Thời trang Hoa Xuân</h1>
        <p className="text-stone-500 max-w-lg mx-auto">
          Phong cách tươi trẻ, năng động — được chọn lọc kỹ lưỡng dành cho bạn.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <a
            href="/products"
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !searchParams.category
                ? "bg-brand-500 text-white border-brand-500"
                : "border-brand-200 text-stone-600 hover:border-brand-400"
            }`}
          >
            Tất cả
          </a>
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                searchParams.category === cat.slug
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-brand-200 text-stone-600 hover:border-brand-400"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg font-display">Chưa có sản phẩm nào</p>
          <p className="text-sm mt-1">Hãy quay lại sau nhé!</p>
        </div>
      )}
    </div>
  );
}
