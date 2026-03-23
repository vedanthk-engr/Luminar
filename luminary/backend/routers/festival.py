from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text, parse_json_response
from models.requests import FestivalRequest

router = APIRouter()

FESTIVAL_SYS = """You are LUMINARY Festival Oracle — the world's foremost AI expert on international film festival submission strategy with deep knowledge of 500+ festivals across every continent.

Analyze the given project and generate a strategic festival roadmap. Return ONLY valid JSON with no markdown or preamble:
{
  "project_assessment": "2-3 sentence honest assessment of festival potential",
  "tier": "A-List or Prestige or Mid-Tier or Emerging",
  "strategy": "Overall submission strategy in 2-3 sentences",
  "festivals": [
    {
      "name": "Festival Name",
      "location": "City, Country",
      "tier": "A-List or Prestige or Specialty or Regional",
      "acceptance_probability": 0-100,
      "submission_window": "e.g. August–October",
      "why_this_festival": "Specific reason this film fits this festival",
      "category": "Competition or Sidebar or Market or Short",
      "strategy_tip": "Specific submission strategy tip for this festival"
    }
  ],
  "circuit_order": ["Festival 1 → Festival 2 → Festival 3"],
  "marketing_angle": "The key positioning angle for festival submissions",
  "avoid": ["Festival name — reason to avoid"]
}
Include exactly 8-10 festivals from diverse continents including Asia, Europe, Americas, Africa minimum."""

@router.post("/strategy")
async def get_festival_strategy(body: FestivalRequest):
    try:
        prompt = f"""Film project:
Title: {body.title}
Genre: {body.genre}
Runtime: {body.runtime} minutes
Country: {body.country}
Language: {body.language}
Budget: {body.budget}
Synopsis: {body.synopsis}"""
        raw = await call_gemini_text(FESTIVAL_SYS, prompt)
        result = parse_json_response(raw)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
