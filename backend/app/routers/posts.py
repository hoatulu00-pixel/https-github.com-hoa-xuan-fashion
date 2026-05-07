from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from datetime import datetime, timezone
from typing import List, Optional
from slugify import slugify
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostOut, PostSummary
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/posts", tags=["posts"])


def _load_options():
    return [joinedload(Post.author), joinedload(Post.category)]


@router.get("", response_model=List[PostSummary])
def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Post).options(*_load_options()).filter(Post.is_published == True)
    if category:
        q = q.join(Post.category).filter(Post.category.has(slug=category))
    if search:
        q = q.filter(Post.title.ilike(f"%{search}%"))
    return q.order_by(desc(Post.published_at)).offset((page - 1) * limit).limit(limit).all()


@router.get("/admin", response_model=List[PostSummary])
def list_all_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    return (
        db.query(Post)
        .options(*_load_options())
        .order_by(desc(Post.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


@router.get("/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).options(*_load_options()).filter(Post.slug == slug, Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=PostOut, status_code=201)
def create_post(
    data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    base_slug = slugify(data.title)
    slug = base_slug
    counter = 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    post = Post(
        **data.model_dump(exclude={"category_id"}),
        slug=slug,
        author_id=current_user.id,
        category_id=data.category_id,
        published_at=datetime.now(timezone.utc) if data.is_published else None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return db.query(Post).options(*_load_options()).get(post.id)


@router.put("/{post_id}", response_model=PostOut)
def update_post(
    post_id: int,
    data: PostUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    update_data = data.model_dump(exclude_unset=True)
    if "title" in update_data:
        post.slug = slugify(update_data["title"])
    if "is_published" in update_data and update_data["is_published"] and not post.published_at:
        post.published_at = datetime.now(timezone.utc)
    for field, value in update_data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return db.query(Post).options(*_load_options()).get(post.id)


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
