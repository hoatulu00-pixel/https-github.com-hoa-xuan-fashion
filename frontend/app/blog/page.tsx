import BlogCard from "@/components/blog/BlogCard";
import type { PostSummary, Category } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getPosts(category?: string, search?: string): Promise<PostSummary[]> {
  const params = new URLSearchParams({ limit: "12" });
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  try {
    const res = await fetch(`${API}/posts?${params}`, { next: { revalidate: 60 } });
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
  title: "Blog thời trang",
  description: "Cập nhật xu hướng thời trang mới nhất từ Hoa Xuân Fashion",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [posts, categories] = await Promise.all([
    getPosts(searchParams.category, searchParams.search),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-brand-500 font-medium text-sm uppercase tracking-wide mb-2">Blog</p>
        <h1 className="section-title text-4xl md:text-5xl mb-4">Thế giới thời trang</h1>
        <p className="text-stone-500 max-w-lg mx-auto">
          Xu hướng, phong cách và cảm hứng thời trang dành cho phụ nữ hiện đại.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <a
            href="/blog"
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
              href={`/blog?category=${cat.slug}`}
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

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg font-display">Chưa có bài viết nào</p>
          <p className="text-sm mt-1">Hãy quay lại sau nhé!</p>
        </div>
      )}
    </div>
  );
}
