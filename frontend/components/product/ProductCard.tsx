import Image from "next/image";
import type { Product } from "@/lib/api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images[0];
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <article className="card group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-50">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-200">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4C8.9 3 8 3.9 8 5v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Nổi bật
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-stone-400 mb-1">{product.category.name}</p>
        )}
        <h3 className="font-medium text-stone-800 text-sm leading-snug mb-2 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-brand-600">
                {formatPrice(Number(product.discount_price))}
              </span>
              <span className="text-stone-400 text-xs line-through">
                {formatPrice(Number(product.price))}
              </span>
            </>
          ) : (
            <span className="font-semibold text-stone-700">
              {formatPrice(Number(product.price))}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
