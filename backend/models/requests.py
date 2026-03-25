from pydantic import BaseModel
from typing import Optional

class SceneTextRequest(BaseModel):
    description: str

class ScriptRequest(BaseModel):
    text: str

class ShotRequest(BaseModel):
    description: str

class VeoRequest(BaseModel):
    description: str

class FestivalRequest(BaseModel):
    title: str
    genre: str
    runtime: str
    country: str
    language: str
    budget: str
    synopsis: str

class AccessRequest(BaseModel):
    scene: str
    mode: str  # "audio" | "cognitive" | "cultural" | "sign"

class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    history: list[ChatMessage]
