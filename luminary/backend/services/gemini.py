import os
import base64
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client = None
def get_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _client

MODEL = "llama-3.3-70b-versatile"
VISION_MODEL = "llama-3.2-90b-vision-preview"

async def call_gemini_text(system: str, user_text: str, max_tokens: int = 1200) -> str:
    """Text call via Groq. Kept same function name to avoid changing routers again."""
    response = get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_text}
        ],
        max_tokens=max_tokens,
        temperature=0.7
    )
    return response.choices[0].message.content

async def call_gemini_vision(system: str, user_text: str, image_b64: str, media_type: str, max_tokens: int = 1200) -> str:
    """Vision call via Groq. Uses llama-3.2-90b-vision-preview."""
    response = get_client().chat.completions.create(
        model=VISION_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{image_b64}"}},
                {"type": "text", "text": user_text}
            ]}
        ],
        max_tokens=max_tokens,
        temperature=0.4
    )
    return response.choices[0].message.content

async def call_gemini_chat(system: str, history: list, max_tokens: int = 1000) -> str:
    """Multi-turn chat via Groq."""
    messages = [{"role": "system", "content": system}]
    for msg in history:
        role = msg["role"] if msg["role"] in ("user", "assistant") else "assistant"
        messages.append({"role": role, "content": msg["content"]})
    
    response = get_client().chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.7
    )
    return response.choices[0].message.content

def parse_json_response(raw: str) -> dict:
    """Strip markdown fences and parse JSON."""
    clean = raw.replace("```json", "").replace("```", "").strip()
    if "{" in clean:
        start = clean.find("{")
        end = clean.rfind("}") + 1
        clean = clean[start:end]
    return json.loads(clean)
