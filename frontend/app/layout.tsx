import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Thời Trang Hoa Xuân | Phong cách trẻ trung, năng động",
    template: "%s | Thời Trang Hoa Xuân",
  },
  description:
    "Khám phá bộ sưu tập thời trang nữ phong cách trẻ trung, năng động từ Hoa Xuân Fashion. Cập nhật xu hướng mới nhất mỗi ngày.",
  keywords: ["thời trang nữ", "thời trang trẻ", "Hoa Xuân", "fashion blog"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Thời Trang Hoa Xuân",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
