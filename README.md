# 🌸 Thời Trang Hoa Xuân

> Blog thời trang nữ phong cách trẻ trung, năng động dành cho thế hệ 18–36 tuổi.

## Tổng quan

**Hoa Xuân Fashion** là web app full-stack bao gồm:
- **Blog thời trang** – bài viết xu hướng, phong cách, cảm hứng
- **Cửa hàng online** – bộ sưu tập thời trang nữ
- **Admin panel** – quản lý nội dung, sản phẩm, danh mục

## Tech Stack

| Thành phần | Công nghệ |
|-----------|-----------|
| Frontend  | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend   | Python FastAPI + SQLAlchemy + Alembic |
| Database  | PostgreSQL |
| Auth      | JWT (python-jose) + bcrypt |
| Storage   | Cloudinary |
| Deploy    | Railway |

## Cấu trúc dự án

```
hoa-xuan-fashion/
├── frontend/          # Next.js 14 app
├── backend/           # FastAPI app
├── README.md
├── CLAUDE.md
├── PLAN.md
└── conversation-export.md
```

## Cài đặt cục bộ

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Điền thông tin DATABASE_URL, SECRET_KEY, ...

# Tạo bảng
alembic upgrade head

# Tạo tài khoản admin đầu tiên
curl -X POST http://localhost:8000/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password","full_name":"Admin"}'

# Chạy server
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # Điền NEXT_PUBLIC_API_URL
npm run dev
```

Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deploy Railway

### Bước 1 – Tạo project trên Railway

1. Vào [railway.app](https://railway.app) → New Project
2. Add **PostgreSQL** plugin (tự động inject `DATABASE_URL`)

### Bước 2 – Deploy Backend

1. New Service → GitHub Repo → chọn folder `backend/`
2. Set environment variables:
   ```
   SECRET_KEY=<random-64-char-string>
   CLOUDINARY_URL=cloudinary://...
   ALLOWED_ORIGINS=https://<frontend-url>.railway.app
   ```

### Bước 3 – Deploy Frontend

1. New Service → GitHub Repo → chọn folder `frontend/`
2. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://<backend-url>.railway.app
   ```

### Bước 4 – Tạo admin đầu tiên

```bash
curl -X POST https://<backend-url>.railway.app/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"strong-password","full_name":"Admin"}'
```

## API Documentation

Xem tại: `https://<backend-url>.railway.app/docs`

Các endpoints chính:
- `POST /auth/login` – Đăng nhập
- `GET /posts` – Danh sách bài viết
- `GET /products` – Danh sách sản phẩm
- `GET /categories` – Danh sách danh mục
- `POST /upload` – Upload ảnh (admin)

## Tính năng

### Trang công khai
- ✅ Homepage với hero, bài viết nổi bật, sản phẩm
- ✅ Blog listing với filter danh mục
- ✅ Blog detail với nội dung rich text
- ✅ Product gallery với filter
- ✅ About page
- ✅ Responsive mobile-first

### Admin Panel (`/admin`)
- ✅ Đăng nhập JWT
- ✅ Quản lý bài viết (CRUD + rich text editor)
- ✅ Quản lý sản phẩm (CRUD + upload ảnh)
- ✅ Quản lý danh mục
- ✅ Upload ảnh qua Cloudinary

## License

MIT © 2024 Hoa Xuân Fashion
