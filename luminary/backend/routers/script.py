from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text, parse_json_response
from models.requests import ScriptRequest

router = APIRouter()

SCRIPT_SYS = """You are LUMINARY Script Intelligence — an elite AI combining a Hollywood script doctor, behavioral economist, and cinematography master. Analyze the script/synopsis and return ONLY valid JSON with no markdown or preamble:
{
  "title": "string",
  "genre": "string",
  "subgenre": "string",
  "logline": "one compelling sentence",
  "tagline": "a marketable tagline",
  "scores": {
    "audience_engagement": 0-100,
    "emotional_depth": 0-100,
    "originality": 0-100,
    "commercial_viability": 0-100,
    "technical_feasibility": 0-100,
    "dialogue_quality": 0-100,
    "thematic_resonance": 0-100
  },
  "budget_tier": "Micro / Low / Mid / High / Blockbuster",
  "estimated_budget_usd": "e.g. $500K–$2M",
  "target_audience": "2 sentences",
  "emotional_arc": "brief arc description",
  "risks": ["r1", "r2", "r3"],
  "strengths": ["s1", "s2", "s3"],
  "missing_elements": ["m1", "m2"],
  "cinematic_references": ["Film (Year)", "Film (Year)"],
  "director_match": ["Director name — why this director"],
  "recommendation": "2-3 sentence actionable production brief"
}"""

@router.post("/analyze")
async def analyze_script(body: ScriptRequest):
    try:
        # Define strict schema for Script Intelligence
        schema = {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING"},
                "genre": {"type": "STRING"},
                "subgenre": {"type": "STRING"},
                "logline": {"type": "STRING"},
                "tagline": {"type": "STRING"},
                "scores": {
                    "type": "OBJECT",
                    "properties": {
                        "audience_engagement": {"type": "INTEGER"},
                        "emotional_depth": {"type": "INTEGER"},
                        "originality": {"type": "INTEGER"},
                        "commercial_viability": {"type": "INTEGER"},
                        "technical_feasibility": {"type": "INTEGER"},
                        "dialogue_quality": {"type": "INTEGER"},
                        "thematic_resonance": {"type": "INTEGER"}
                    },
                    "required": ["audience_engagement", "emotional_depth", "originality", "commercial_viability", "technical_feasibility", "dialogue_quality", "thematic_resonance"]
                },
                "budget_tier": {"type": "STRING"},
                "estimated_budget_usd": {"type": "STRING"},
                "target_audience": {"type": "STRING"},
                "emotional_arc": {"type": "STRING"},
                "risks": {"type": "ARRAY", "items": {"type": "STRING"}},
                "strengths": {"type": "ARRAY", "items": {"type": "STRING"}},
                "missing_elements": {"type": "ARRAY", "items": {"type": "STRING"}},
                "cinematic_references": {"type": "ARRAY", "items": {"type": "STRING"}},
                "director_match": {"type": "ARRAY", "items": {"type": "STRING"}},
                "recommendation": {"type": "STRING"}
            },
            "required": ["title", "genre", "logline", "scores", "budget_tier"]
        }

        raw = await call_gemini_text(SCRIPT_SYS, body.text, response_schema=schema)
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
