from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text, parse_json_response
from models.requests import ShotRequest

router = APIRouter()

SHOTS_SYS = """You are LUMINARY Shot Composer — a master cinematographer combining Emmanuel Lubezki, Roger Deakins, and Christopher Nolan. Generate a complete professional shot list. Return ONLY valid JSON:
{
  "scene_title": "string",
  "scene_mood": "e.g. Tense / Melancholic / Euphoric",
  "suggested_lens": "e.g. 35mm Spherical",
  "color_grade": "e.g. Desaturated teal with warm highlights",
  "shots": [
    {
      "shot_number": 1,
      "shot_type": "e.g. Extreme Wide / Medium Close-Up / ECU",
      "angle": "e.g. Low angle / Eye level / Bird's eye / Dutch",
      "movement": "e.g. Static / Slow push in / Handheld / Tracking left",
      "lens": "e.g. 24mm wide / 85mm portrait / 200mm telephoto",
      "description": "What this shot shows and why it works narratively",
      "lighting": "Key light setup for this shot",
      "duration_seconds": 0-30,
      "emotion": "What emotion this shot targets in the audience"
    }
  ],
  "lighting_plan": "Overall scene lighting philosophy",
  "sound_design_notes": "Key sound elements to design for this scene",
  "director_note": "Overall directorial intent for the scene"
}
Generate exactly 6-8 shots. Be specific and professional."""

@router.post("/compose")
async def compose_shots(body: ShotRequest):
    try:
        raw = await call_gemini_text(SHOTS_SYS, body.description)
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
