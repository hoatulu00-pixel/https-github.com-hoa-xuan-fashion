import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { PostSummary } from "@/lib/api";

export default function BlogCard({ post }: { post: PostSummary }) {
  const date = post.published_at || post.created_at;

  return (
    <article className="card group">
      {post.cover_image_url && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        {post.category && (
          <span className="inline-block text-xs font-medium text-brand-500 uppercase tracking-wide mb-2">
            {post.category.name}
          </span>
        )}
        <h2 className="font-display text-xl font-semibold text-stone-800 leading-snug mb-2 group-hover:text-brand-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="text-stone-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>{post.author.full_name}</span>
          <span>{format(new Date(date), "d MMM yyyy", { locale: vi })}</span>
        </div>
      </div>
    </article>
  );
}
