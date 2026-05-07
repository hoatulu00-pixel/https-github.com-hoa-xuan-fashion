import { Heart, Sparkles, Users, Leaf } from "lucide-react";

export const metadata = {
  title: "Về chúng tôi",
  description: "Câu chuyện thương hiệu Hoa Xuân Fashion",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-brand py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-500 font-medium uppercase tracking-wide text-sm mb-3">Về chúng tôi</p>
          <h1 className="font-display text-5xl font-bold text-stone-800 mb-6">
            Câu chuyện Hoa Xuân
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Ra đời từ tình yêu với vẻ đẹp tự nhiên và phong cách sống năng động, Hoa Xuân Fashion là nơi thời trang gặp gỡ cá tính.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-stone-800 mb-5">
              Nguồn cảm hứng từ mùa xuân
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Hoa Xuân ra đời vào năm 2024, được truyền cảm hứng bởi sự tươi mới và năng động của mùa xuân — mùa của những khởi đầu mới, sắc màu rực rỡ và sức sống bất tận.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Chúng tôi tin rằng thời trang không chỉ là quần áo — mà là ngôn ngữ biểu đạt bản thân. Mỗi sản phẩm được chọn lọc kỹ lưỡng để giúp bạn tỏa sáng theo cách của riêng mình.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Với sứ mệnh mang phong cách trẻ trung, hiện đại đến gần hơn với phụ nữ Việt Nam, Hoa Xuân không ngừng cập nhật và sáng tạo mỗi ngày.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-brand-100 to-rose-100 rounded-3xl p-10 text-center">
              <span className="text-8xl block mb-4">🌸</span>
              <p className="font-display text-2xl font-semibold text-brand-700 italic">
                "Vẻ đẹp không có giới hạn — chỉ có phong cách riêng của bạn."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, color: "text-rose-500", title: "Tận tâm", desc: "Mỗi sản phẩm được chọn với tình yêu và sự cẩn thận." },
              { icon: Sparkles, color: "text-brand-500", title: "Sáng tạo", desc: "Luôn tìm kiếm phong cách mới, xu hướng độc đáo." },
              { icon: Users, color: "text-purple-500", title: "Cộng đồng", desc: "Xây dựng cộng đồng phụ nữ tự tin và truyền cảm hứng." },
              { icon: Leaf, color: "text-green-500", title: "Bền vững", desc: "Ưu tiên chất liệu thân thiện, bền đẹp theo thời gian." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                <h3 className="font-display text-lg font-semibold text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="section-title mb-4">Đội ngũ của chúng tôi</h2>
        <p className="text-stone-500 mb-12 max-w-lg mx-auto">
          Những con người đam mê thời trang, yêu cái đẹp và luôn muốn truyền cảm hứng cho cộng đồng.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { name: "Linh Nguyễn", role: "Creative Director", emoji: "👗" },
            { name: "Minh Anh", role: "Content Creator", emoji: "✍️" },
            { name: "Hương Trần", role: "Fashion Stylist", emoji: "🎨" },
          ].map((member) => (
            <div key={member.name} className="p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-rose-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {member.emoji}
              </div>
              <h3 className="font-display text-lg font-semibold text-stone-800">{member.name}</h3>
              <p className="text-brand-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
