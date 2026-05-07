import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-50 border-t border-brand-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-6 h-6 text-brand-500" />
              <span className="font-display text-lg font-semibold text-brand-700">Hoa Xuân Fashion</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Thời trang nữ phong cách trẻ trung, năng động dành cho thế hệ 18–36 tuổi tự tin và hiện đại.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-stone-700 mb-3">Khám phá</h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog thời trang" },
                { href: "/products", label: "Sản phẩm" },
                { href: "/about", label: "Về chúng tôi" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-stone-500 hover:text-brand-600 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-stone-700 mb-3">Liên hệ</h3>
            <p className="text-stone-500 text-sm">hoaxuanfashion@email.com</p>
            <p className="text-stone-500 text-sm mt-1">Hà Nội, Việt Nam</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-100 flex items-center justify-center gap-1 text-stone-400 text-sm">
          <span>© 2024 Hoa Xuân Fashion. Made with</span>
          <Heart className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
          <span>in Vietnam</span>
        </div>
      </div>
    </footer>
  );
}
