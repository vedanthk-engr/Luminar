import os
import base64
import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()

router = APIRouter(prefix="/api/images", tags=["images"])

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

def get_imagen_client():
    try:
        return genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=LOCATION
        )
    except Exception as e:
        print(f"Imagen Client Init Error: {e}")
        return None

client = get_imagen_client()

class ImageRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "16:9"

# Cache disabled for development to ensure fresh results
image_cache = {}

@router.get("/ping")
async def ping_images():
    return {"status": "ok", "message": "Images router is active"}

@router.post("/generate")
async def generate_image(req: ImageRequest):
    print(f"DEBUG: generate_image hit with prompt: {req.prompt[:50]}...")
    """Generate a high-fidelity cinematic image using Imagen 3."""
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt is required")
    
    # Check cache
    cache_key = hashlib.md5(f"{req.prompt}_{req.aspect_ratio}".encode()).hexdigest()
    if cache_key in image_cache:
        return image_cache[cache_key]

    global client
    if client is None:
        client = get_imagen_client()
    
    if client is None:
        raise HTTPException(500, "Vertex AI client not initialized. Check GCP credentials.")

    try:
        # Enhance prompt via Gemini for "wow" factor
        ENHANCE_SYS = """You are an expert cinematic concept artist and prompt engineer. 
Your goal is to take a simple script idea and expand it into a detailed, high-fidelity, photorealistic prompt for Imagen 3.
CRITICAL RULES:
1. MANDATORY PHOTOREALISM: Use keywords like '35mm film still', 'shot on Arri Alexa', 'anamorphic lens', 'cinematic lighting', 'high-fidelity', 'photorealistic'.
2. NO ABSTRACT/GRAIN: Avoid placeholder styles, abstract shapes, or excessive digital grain.
3. PHYSICAL DETAIL: Describe specific textures (pores on skin, damp fabric, rainy asphalt) and environmental depth.
4. COMPOSITION: Specify camera position (e.g., 'Medium close-up', 'Low angle', 'Wide cinematic shot').
5. LIGHTING: Describe professional film lighting (e.g., 'Volumetric lighting', 'Golden hour', 'Cool moonlight with warm rim light').
6. Output ONLY the enhanced prompt. No conversational filler."""

        enhancer_resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[ENHANCE_SYS, f"Original Idea: {req.prompt}"]
        )
        enhanced_prompt = enhancer_resp.text
        print(f"DEBUG: Enhanced Prompt: {enhanced_prompt}")

        # Use Imagen 3.0 with the enhanced prompt, fallback to legacy if needed
        try:
            response = client.models.generate_images(
                model="imagen-3.0-generate-001",
                prompt=enhanced_prompt,
                config=genai.types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=req.aspect_ratio,
                    include_rai_reason=True,
                    output_mime_type="image/jpeg"
                )
            )
        except Exception as e:
            print(f"DEBUG: Imagen 3.0 failed ({e}), trying fallback imagegeneration@006")
            response = client.models.generate_images(
                model="imagegeneration@006",
                prompt=enhanced_prompt,
                config=genai.types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=req.aspect_ratio,
                    include_rai_reason=True,
                    output_mime_type="image/jpeg"
                )
            )

        if not response.generated_images:
            raise HTTPException(500, "Imagen 3 returned no images. Check safety filters or prompt.")

        img_obj = response.generated_images[0]
        # In this SDK version, the image data is in .image_bytes
        img_bytes = getattr(img_obj, 'image_bytes', None)
        
        if not img_bytes:
            # Fallback for different SDK versions (e.g. PIL Image)
            img_bytes = getattr(img_obj, 'image', None)
            if hasattr(img_bytes, 'save'):
                import io
                buf = io.BytesIO()
                img_bytes.save(buf, format="JPEG")
                img_bytes = buf.getvalue()
            elif hasattr(img_bytes, 'data'):
                img_bytes = img_bytes.data

        if not img_bytes:
            raise HTTPException(500, "Could not extract image bytes from response.")

        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        
        result = {
            "image_b64": img_b64,
            "mime_type": "image/jpeg"
        }
        
        # Cache it
        image_cache[cache_key] = result
        return result

    except Exception as e:
        print(f"Imagen Gen Error: {e}")
        raise HTTPException(500, f"Image generation failed: {str(e)}")
