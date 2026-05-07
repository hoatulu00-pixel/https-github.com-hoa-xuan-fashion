from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from app.schemas.category import CategoryOut


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    images: List[str] = []
    tags: List[str] = []
    is_featured: bool = False
    is_active: bool = True
    category_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    discount_price: Optional[Decimal] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    images: List[str] = []
    tags: List[str] = []
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None

    model_config = {"from_attributes": True}
