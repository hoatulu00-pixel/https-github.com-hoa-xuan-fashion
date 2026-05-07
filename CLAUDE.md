# CLAUDE.md – Hoa Xuân Fashion

Context file for Claude Code. Đọc file này để hiểu cấu trúc và quy ước của dự án.

## Tổng quan dự án

Web app full-stack cho thương hiệu thời trang nữ "Thời Trang Hoa Xuân":
- Target: phụ nữ 18–36 tuổi, phong cách trẻ trung, năng động
- Frontend: Next.js 14 (App Router) – `frontend/`
- Backend: FastAPI + SQLAlchemy – `backend/`
- DB: PostgreSQL
- Deploy: Railway

## Cấu trúc backend (`backend/`)

```
app/
├── main.py          # FastAPI app, CORS, routers
├── config.py        # Settings từ env vars (pydantic-settings)
├── database.py      # SQLAlchemy engine + get_db()
├── dependencies.py  # get_current_user, get_admin_user
├── models/          # SQLAlchemy models (User, Category, Post, Product)
├── schemas/         # Pydantic v2 schemas (in/out DTOs)
├── routers/         # auth, categories, posts, products, upload
└── services/        # auth_service (JWT/bcrypt), cloudinary_service
```

**Quy tắc backend:**
- Pydantic v2: dùng `model_dump()`, không phải `dict()`
- Tất cả response model phải có `model_config = {"from_attributes": True}`
- Admin endpoints dùng `Depends(get_admin_user)`
- Slugify tên tự động từ `python-slugify`

## Cấu trúc frontend (`frontend/`)

```
app/
├── layout.tsx               # Root layout (Navbar + Footer)
├── page.tsx                 # Homepage
├── blog/                    # Blog listing + detail
├── products/                # Product gallery
├── about/                   # About page
└── admin/                   # Protected admin panel
    ├── layout.tsx           # Sidebar layout + auth guard
    ├── login/               # Login page
    ├── posts/               # Post CRUD
    ├── products/            # Product CRUD
    └── categories/          # Category CRUD
components/
├── layout/                  # Navbar, Footer
├── blog/                    # BlogCard
├── product/                 # ProductCard
└── admin/                   # PostEditor, ProductForm
lib/
├── api.ts                   # Axios instance + TypeScript types
└── auth.ts                  # login/logout/getToken helpers
```

**Quy tắc frontend:**
- Server components mặc định; thêm `"use client"` khi cần state/effects
- Fetch dữ liệu trong server components với `{ next: { revalidate: N } }`
- Client components dùng `api.ts` (Axios với JWT interceptor)
- JWT lưu trong cookie `hx_token` (7 ngày)
- Màu brand: `brand-*` (pink-400 palette), xem `tailwind.config.ts`
- Font: Playfair Display (display/headings), Inter (body)
- Class utility: `btn-primary`, `btn-outline`, `card`, `section-title` (xem `globals.css`)

## Env vars

**Backend** (`.env`):
```
DATABASE_URL=postgresql://...
SECRET_KEY=...
CLOUDINARY_URL=cloudinary://...
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Chạy local

```bash
# Backend
cd backend && uvicorn app.main:app --reload

# Frontend
cd frontend && npm run dev

# Migrations
cd backend && alembic upgrade head

# Tạo admin đầu tiên
curl -X POST http://localhost:8000/auth/setup -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password","full_name":"Admin"}'
```

## Database migrations

Khi thêm/sửa model, chạy:
```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Railway deploy

- Backend: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Frontend: `next build && next start`
- PostgreSQL: Railway plugin (tự inject `DATABASE_URL`)
