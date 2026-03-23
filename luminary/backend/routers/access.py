from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.gemini import call_gemini_text
from models.requests import AccessRequest

router = APIRouter()

MODE_PROMPTS = {
    "audio": """You are CineAccess Audio Description Engine — a professional audio describer for blind and low-vision viewers. Given a scene, write a vivid, precise, professional audio description suitable for broadcast narration. Include: spatial details, character appearance and action, setting atmosphere, on-screen text, and emotional tone. Be cinematic but precise. Third person present tense. Avoid interpretation — describe what is visible.""",

    "cognitive": """You are CineAccess Cognitive Accessibility Engine. Rewrite scene descriptions for neurodivergent viewers and those with cognitive disabilities. Rules: Maximum 12 words per sentence. Plain everyday vocabulary only. No metaphors or idioms. Explicit transition labels: [SCENE CHANGE] [LOUD SOUND] [KEY MOMENT] [TIME PASSES] [NEW CHARACTER]. Step-by-step action descriptions. Warm, clear, friendly tone.""",

    "cultural": """You are CineAccess Cultural Intelligence Engine. For the given scene: 1. List cultural references that need explanation for international audiences. 2. Identify idioms or context that may not translate across cultures. 3. Provide sensitivity flags for at least 3 specific regions or cultures. 4. Suggest adaptive versions for 3 different cultural markets. Be respectful, nuanced, and specific. Format with clear numbered headers.""",

    "sign": """You are CineAccess Deaf and Hard-of-Hearing Adaptation Specialist. For the given scene provide: 1. Which dialogue and sounds must be conveyed through intertitles and how. 2. How to adapt visual storytelling for deaf audiences (visual cues to emphasize). 3. Sign language stage directions for a live performance adaptation. 4. Key non-verbal emotion cues to make more explicit in the visual direction. Be specific and practical for a production team to implement."""
}

@router.post("/generate")
async def generate_accessibility(body: AccessRequest):
    if body.mode not in MODE_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Invalid mode. Use: {list(MODE_PROMPTS.keys())}")
    try:
        output = await call_gemini_text(MODE_PROMPTS[body.mode], body.scene)
        return JSONResponse(content={"mode": body.mode, "output": output})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
