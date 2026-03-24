import os
import base64
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

_client = None
def get_client():
    global _client
    if _client is None:
        _client = genai.Client(
            vertexai=True,
            project=os.getenv("GCP_PROJECT_ID", "luminar-18"),
            location=os.getenv("GCP_LOCATION", "us-central1")
        )
    return _client

MODEL = "gemini-2.5-flash"
VISION_MODEL = "gemini-2.5-flash"

async def call_gemini_text(system: str, user_text: str, max_tokens: int = 4096, response_schema: dict = None) -> str:
    """Text call via Vertex AI with optional schema."""
    config = genai.types.GenerateContentConfig(
        max_output_tokens=max_tokens,
        temperature=0.7,
        response_mime_type="application/json",
        response_schema=response_schema
    )
    response = get_client().models.generate_content(
        model=MODEL,
        contents=[system, user_text],
        config=config
    )
    if not response or not hasattr(response, 'text') or not response.text:
        raise ValueError("AI Text response was empty or filtered.")
    return response.text

async def call_gemini_vision(system: str, user_text: str, image_b64: str, media_type: str, max_tokens: int = 4096, response_schema: dict = None) -> str:
    """Vision call via Vertex AI with optional schema."""
    config = genai.types.GenerateContentConfig(
        max_output_tokens=max_tokens,
        temperature=0.4,
        response_mime_type="application/json",
        response_schema=response_schema
    )
    response = get_client().models.generate_content(
        model=VISION_MODEL,
        contents=[
            system,
            genai.types.Content(
                role="user",
                parts=[
                    genai.types.Part.from_bytes(
                        data=base64.b64decode(image_b64), 
                        mime_type=media_type
                    ),
                    genai.types.Part.from_text(text=user_text)
                ]
            )
        ],
        config=config
    )
    if not response or not hasattr(response, 'text') or not response.text:
        raise ValueError("AI Vision response was empty or filtered.")
    return response.text

async def call_gemini_chat(system: str, history: list, max_tokens: int = 1500) -> str:
    """Multi-turn chat via Vertex AI."""
    contents = []
    # Gemini 2.0 Flash handles system instructions best via config or a specifically labeled content
    for h in history:
        role = "user" if h["role"] == "user" else "model"
        contents.append(genai.types.Content(role=role, parts=[genai.types.Part.from_text(text=h["content"])]))
    
    response = get_client().models.generate_content(
        model=MODEL,
        contents=[genai.types.Content(role="user", parts=[genai.types.Part.from_text(text=f"System Instructions: {system}")])] + contents,
        config=genai.types.GenerateContentConfig(
            max_output_tokens=max_tokens,
            temperature=0.7
        )
    )
    if not response or not hasattr(response, 'text') or not response.text:
        return "I'm sorry, I couldn't generate a chat response."
    return response.text

def parse_json_response(raw: str) -> dict:
    """Robustly extract and parse JSON from AI response."""
    print(f"DEBUG: Raw AI Response Length: {len(raw)}")
    
    # 1. Extract markdown code blocks if present
    import re
    code_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw)
    if code_block_match:
        clean = code_block_match.group(1).strip()
    else:
        # Fallback to finding first { and last }
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            clean = raw[start:end+1].strip()
        else:
            clean = raw.strip()

    if not clean:
        raise ValueError("AI response contained no valid JSON structure.")

    # 2. Basic cleanup for common AI slips
    # Remove trailing commas before } or ]
    clean = re.sub(r',\s*([}\]])', r'\1', clean)

    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"DEBUG: Initial JSON parse failed: {e}. Attempting recovery...")
        
        # 3. Recovery: Handle unescaped newlines and quotes inside strings
        fixed = clean
        
        # Find all strings and escape their newlines
        def escape_newlines(match):
            return match.group(0).replace("\n", "\\n").replace("\r", "\\r")
        
        fixed = re.sub(r'":\s*"[\s\S]*?"(?=\s*[,}\]])', escape_newlines, fixed)
        
        # 4. Final attempt: close truncated JSON more intelligently
        # We try to add closing brackets and braces in common combinations
        attempts = [
            fixed,
            fixed + "}",
            fixed + "]}",
            fixed + "}]}",
            fixed + "}]}]}"
        ]
        
        for candidate in attempts:
            try:
                return json.loads(candidate)
            except:
                continue
                
        # If still failing, try one last super-aggressive fix for unescaped newlines everywhere
        try:
            super_fixed = clean.replace("\n", " ").replace("\r", " ")
            return json.loads(super_fixed)
        except:
            pass

        print(f"FATAL: JSON Recovery failed. Raw start: {clean[:100]}")
        raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
