import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("hx_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// ── Types ──────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Author {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  author: Author;
  category?: Category;
}

export interface Post extends PostSummary {
  content: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  category?: Category;
}
