from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserOut
from app.schemas.category import CategoryOut


class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_published: bool = False
    category_id: Optional[int] = None


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_published: Optional[bool] = None
    category_id: Optional[int] = None


class PostOut(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: UserOut
    category: Optional[CategoryOut] = None

    model_config = {"from_attributes": True}


class PostSummary(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    author: UserOut
    category: Optional[CategoryOut] = None

    model_config = {"from_attributes": True}
