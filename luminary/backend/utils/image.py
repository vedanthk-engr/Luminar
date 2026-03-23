import base64
from PIL import Image
import io

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 20

def validate_and_encode_image(file_bytes: bytes, content_type: str) -> tuple[str, str]:
    """
    Validates image type and size, returns (base64_string, media_type).
    Raises ValueError if invalid.
    """
    if content_type not in ALLOWED_TYPES:
        raise ValueError(f"Unsupported image type: {content_type}. Use JPEG, PNG, or WEBP.")
    
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise ValueError(f"Image too large: {size_mb:.1f}MB. Maximum is {MAX_SIZE_MB}MB.")
    
    # Validate it's a real image using Pillow
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except Exception:
        raise ValueError("File is not a valid image.")
    
    b64 = base64.b64encode(file_bytes).decode("utf-8")
    return b64, content_type
