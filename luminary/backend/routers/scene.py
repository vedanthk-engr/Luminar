from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text, call_gemini_vision, parse_json_response
from models.requests import SceneTextRequest
from utils.image import validate_and_encode_image
from typing import Optional

router = APIRouter()

AUTOPSY_SYS = """You are LUMINARY Scene Autopsy Engine — the world's most advanced AI film critic combining the expertise of Roger Deakins (cinematography), Sidney Lumet (direction), and Roland Barthes (semiotics).

Analyze the provided film scene with professional precision.

Return ONLY a valid JSON object. No markdown. No preamble. No extra text. Just JSON.

{
  "title": "Inferred film title or 'Untitled Scene'",
  "overall_score": 0-100,
  "verdict": "2-sentence powerful professional verdict",
  "cinematography": 0-100,
  "lighting": 0-100,
  "composition": 0-100,
  "narrative_power": 0-100,
  "emotional_impact": 0-100,
  "technical_execution": 0-100,
  "color_grade": 0-100,
  "scene_type": "e.g. Establishing Shot / Climax / Exposition / Action",
  "dominant_emotion": "e.g. Dread / Hope / Isolation / Joy",
  "camera_analysis": "Technical observation: angle, lens type, depth of field, movement",
  "lighting_analysis": "Lighting setup: key light direction, contrast ratio, mood created",
  "color_palette": "Color story and what it communicates emotionally",
  "narrative_function": "What story role this scene plays and what it advances",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "reference_directors": ["Director (Film)", "Director (Film)"],
  "production_era_guess": "e.g. 2010s Hollywood / Contemporary South Asian",
  "reframe_suggestion": "A specific actionable suggestion to improve the shot"
}"""

@router.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    """Analyze a scene from an uploaded image file."""
    try:
        contents = await file.read()
        b64, media_type = validate_and_encode_image(contents, file.content_type)
        raw = await call_gemini_vision(
            AUTOPSY_SYS,
            "Analyze this film scene image with full professional critique.",
            b64,
            media_type
        )
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/text")
async def analyze_text(body: SceneTextRequest):
    """Analyze a scene from a text description."""
    try:
        raw = await call_gemini_text(
            AUTOPSY_SYS,
            f"Analyze this described film scene as if you are watching it: \"{body.description}\""
        )
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
