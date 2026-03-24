from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text, parse_json_response
from models.requests import VeoRequest

router = APIRouter()

VEO_SYS = """You are LUMINARY VeoPrompt Engineer — the world's leading expert in generative video AI prompt engineering for Veo3, Runway Gen-3 Alpha, Pika Labs, and Sora.

Transform scene descriptions into precision-engineered generation prompts. Return ONLY valid JSON with no markdown or preamble:
{
  "scene_title": "string",
  "veo3_prompt": "A 200-300 word ultra-detailed Veo3 prompt with full cinematic language, camera specs, lighting, movement, atmosphere, style references",
  "runway_prompt": "A concise 80-100 word Runway Gen-3 prompt focused on action and visual style",
  "pika_prompt": "A compact 60-80 word Pika Labs prompt with essential style keywords",
  "negative_prompt": "Comma-separated list of what to avoid in generation",
  "technical_specs": {
    "aspect_ratio": "16:9 or 2.39:1 or 9:16",
    "duration_seconds": 5-30,
    "fps": 24,
    "resolution": "1080p or 4K",
    "camera_motion": "e.g. Slow dolly push / static wide / handheld follow",
    "lighting_style": "e.g. Golden hour backlight / neon practical / tungsten interior",
    "color_grade": "e.g. Desaturated teal shadows with warm highlights",
    "film_grain": "subtle or moderate or heavy",
    "depth_of_field": "shallow or deep"
  },
  "style_references": ["Film title (Director)", "Film title (Director)"],
  "mood_keywords": ["word1", "word2", "word3", "word4", "word5"],
  "prompt_tips": ["tip 1", "tip 2", "tip 3"],
  "generation_warnings": ["potential issue to watch for"]
}"""

@router.post("/generate")
async def generate_prompts(body: VeoRequest):
    try:
        # Define strict schema for VeoPrompt
        schema = {
            "type": "OBJECT",
            "properties": {
                "scene_title": {"type": "STRING"},
                "veo3_prompt": {"type": "STRING"},
                "runway_prompt": {"type": "STRING"},
                "pika_prompt": {"type": "STRING"},
                "negative_prompt": {"type": "STRING"},
                "technical_specs": {
                    "type": "OBJECT",
                    "properties": {
                        "aspect_ratio": {"type": "STRING"},
                        "duration_seconds": {"type": "INTEGER"},
                        "fps": {"type": "INTEGER"},
                        "resolution": {"type": "STRING"},
                        "camera_motion": {"type": "STRING"},
                        "lighting_style": {"type": "STRING"},
                        "color_grade": {"type": "STRING"},
                        "film_grain": {"type": "STRING"},
                        "depth_of_field": {"type": "STRING"}
                    }
                },
                "style_references": {"type": "ARRAY", "items": {"type": "STRING"}},
                "mood_keywords": {"type": "ARRAY", "items": {"type": "STRING"}},
                "prompt_tips": {"type": "ARRAY", "items": {"type": "STRING"}},
                "generation_warnings": {"type": "ARRAY", "items": {"type": "STRING"}}
            },
            "required": ["scene_title", "veo3_prompt"]
        }

        raw = await call_gemini_text(VEO_SYS, body.description, response_schema=schema)
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
