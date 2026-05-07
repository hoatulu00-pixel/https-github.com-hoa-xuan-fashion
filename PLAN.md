# PLAN.md – Kế hoạch xây dựng Thời Trang Hoa Xuân

> File này được tạo bởi Claude Code trong quá trình lập kế hoạch dự án.

## Bối cảnh

Xây dựng web app full-stack cho thương hiệu thời trang nữ **"Thời Trang Hoa Xuân"**, hướng đến đối tượng phụ nữ 18–36 tuổi với phong cách trẻ trung, năng động.

**Yêu cầu:**
- Full-stack (Next.js + FastAPI + PostgreSQL)
- Code trên GitHub, URL công khai
- Deploy trên Railway
- Có đủ 4 file: README.md, CLAUDE.md, PLAN.md, conversation-export.md

## Tech Stack quyết định

| Thành phần | Công nghệ | Lý do chọn |
|-----------|-----------|------------|
| Frontend | Next.js 14 App Router | Server components, SEO tốt cho blog |
| Styling | Tailwind CSS | Rapid UI, brand colors dễ customize |
| Backend | FastAPI (Python) | Hiệu năng cao, auto docs, async |
| ORM | SQLAlchemy + Alembic | Mature, type-safe migrations |
| Auth | JWT + bcrypt | Stateless, dễ deploy |
| Storage | Cloudinary | CDN tự động, transform ảnh |
| Deploy | Railway | Dễ dùng, PostgreSQL plugin |

## Kiến trúc hệ thống

```
Internet
    │
    ├── Railway Frontend (Next.js)
    │       ├── Serves SSR/SSG pages
    │       └── Calls Backend API
    │
    ├── Railway Backend (FastAPI)
    │       ├── REST API
    │       ├── JWT auth
    │       └── Cloudinary upload
    │
    └── Railway PostgreSQL
            └── Managed database
```

## Database Schema

```
users: id, email, hashed_password, full_name, is_admin, created_at
categories: id, name, slug, description
posts: id, title, slug, content, excerpt, cover_image_url, is_published, published_at, author_id→users, category_id→categories
products: id, name, slug, description, price, discount_price, images(JSONB), tags(JSONB), is_featured, is_active, category_id→categories
```

## Trang và tính năng

### Public
- `/` – Homepage: hero, bài viết nổi bật, sản phẩm nổi bật, newsletter
- `/blog` – Blog listing: filter danh mục, tìm kiếm
- `/blog/[slug]` – Blog detail: nội dung đầy đủ, metadata
- `/products` – Product gallery: filter danh mục, hover effects
- `/about` – Brand story, giá trị, team

### Admin (`/admin`, JWT protected)
- `/admin/login` – Trang đăng nhập
- `/admin` – Dashboard với stats
- `/admin/posts` – CRUD bài viết + rich text editor (Tiptap)
- `/admin/products` – CRUD sản phẩm + image upload
- `/admin/categories` – CRUD danh mục

## Design System

- **Primary**: `#F472B6` (pink-400) — màu chủ đạo
- **Accent**: `#FB7185` (rose-400) — màu nhấn, sale badges
- **Neutral**: `#1C1917` (stone-950) — text
- **Font heading**: Playfair Display (serif, sang trọng)
- **Font body**: Inter (clean, dễ đọc)
- **Style**: Clean, minimal, feminine — modern Korean/Japandi aesthetic

## Các bước triển khai

1. ✅ Init repo, cấu trúc thư mục
2. ✅ Backend: models, schemas, routers, auth, migrations
3. ✅ Frontend: pages, components, admin panel
4. ✅ Required files: README, CLAUDE, PLAN, conversation-export
5. ✅ Railway config: railway.toml cho cả frontend và backend
6. ⬜ Push lên GitHub (repo public)
7. ⬜ Deploy Railway: connect GitHub, set env vars
8. ⬜ Seed data: tạo admin + bài viết + sản phẩm mẫu

## Checklist deploy

- [ ] Tạo GitHub repo public `hoa-xuan-fashion`
- [ ] Push code lên GitHub
- [ ] Railway: tạo project, add PostgreSQL plugin
- [ ] Railway: deploy backend service, set env vars
- [ ] Railway: deploy frontend service, set `NEXT_PUBLIC_API_URL`
- [ ] Tạo admin account đầu tiên qua `/auth/setup`
- [ ] Verify public URL hoạt động
- [ ] Seed bài viết và sản phẩm mẫu
