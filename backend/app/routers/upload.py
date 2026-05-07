from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.dependencies import get_admin_user
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    _: User = Depends(get_admin_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, GIF allowed")
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    url = upload_image(contents)
    return {"url": url}
