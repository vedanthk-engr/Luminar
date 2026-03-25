import anthropic
import os
import base64
from typing import Optional

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-20250514"

async def call_claude_text(system: str, user_text: str, max_tokens: int = 1200) -> str:
    """Single-turn text-only call. Used by all modules except Scene Autopsy and CineChat."""
    message = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_text}]
    )
    return message.content[0].text

async def call_claude_vision(system: str, user_text: str, image_b64: str, media_type: str, max_tokens: int = 1200) -> str:
    """Single-turn multimodal call with base64 image. Used by Scene Autopsy."""
    message = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": image_b64
                    }
                },
                {"type": "text", "text": user_text}
            ]
        }]
    )
    return message.content[0].text

async def call_claude_chat(system: str, history: list[dict], max_tokens: int = 1000) -> str:
    """Multi-turn conversation call. Used by CineChat. history = [{role, content}, ...]"""
    message = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=history
    )
    return message.content[0].text

def parse_json_response(raw: str) -> dict:
    """Strip markdown fences and parse JSON. Raises ValueError on failure."""
    import json
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)
