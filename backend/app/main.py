from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, categories, posts, products, upload

app = FastAPI(
    title="Thời Trang Hoa Xuân API",
    description="Backend API for Hoa Xuan Fashion blog & store",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(posts.router)
app.include_router(products.router)
app.include_router(upload.router)


@app.get("/")
def health():
    return {"status": "ok", "service": "Hoa Xuan Fashion API"}
