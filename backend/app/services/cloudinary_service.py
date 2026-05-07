import cloudinary
import cloudinary.uploader
from app.config import settings


def configure_cloudinary():
    if settings.CLOUDINARY_URL:
        cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)


def upload_image(file_bytes: bytes, folder: str = "hoaxuan") -> str:
    configure_cloudinary()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="image",
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    return result["secure_url"]
