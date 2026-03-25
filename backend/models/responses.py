from pydantic import BaseModel
from typing import Optional

class SceneScores(BaseModel):
    cinematography: int
    lighting: int
    composition: int
    narrative_power: int
    emotional_impact: int
    technical_execution: int
    color_grade: int

class SceneAutopsyResponse(BaseModel):
    title: str
    overall_score: int
    verdict: str
    scores: SceneScores
    scene_type: str
    dominant_emotion: str
    camera_analysis: str
    lighting_analysis: str
    color_palette: str
    narrative_function: str
    strengths: list[str]
    improvements: list[str]
    reference_directors: list[str]
    production_era_guess: str
    reframe_suggestion: str

class ScriptScores(BaseModel):
    audience_engagement: int
    emotional_depth: int
    originality: int
    commercial_viability: int
    technical_feasibility: int
    dialogue_quality: int
    thematic_resonance: int

class ScriptAlchemistResponse(BaseModel):
    title: str
    genre: str
    subgenre: str
    logline: str
    tagline: str
    scores: ScriptScores
    budget_tier: str
    estimated_budget_usd: str
    target_audience: str
    emotional_arc: str
    risks: list[str]
    strengths: list[str]
    missing_elements: list[str]
    cinematic_references: list[str]
    director_match: list[str]
    recommendation: str

class Shot(BaseModel):
    shot_number: int
    shot_type: str
    angle: str
    movement: str
    lens: str
    description: str
    lighting: str
    duration_seconds: int
    emotion: str

class ShotComposerResponse(BaseModel):
    scene_title: str
    scene_mood: str
    suggested_lens: str
    color_grade: str
    shots: list[Shot]
    lighting_plan: str
    sound_design_notes: str
    director_note: str

class TechSpecs(BaseModel):
    aspect_ratio: str
    duration_seconds: int
    fps: int
    resolution: str
    camera_motion: str
    lighting_style: str
    color_grade: str
    film_grain: str
    depth_of_field: str

class VeoPromptResponse(BaseModel):
    scene_title: str
    veo3_prompt: str
    runway_prompt: str
    pika_prompt: str
    negative_prompt: str
    technical_specs: TechSpecs
    style_references: list[str]
    mood_keywords: list[str]
    prompt_tips: list[str]
    generation_warnings: list[str]

class Festival(BaseModel):
    name: str
    location: str
    tier: str
    acceptance_probability: int
    submission_window: str
    why_this_festival: str
    category: str
    strategy_tip: str

class FestivalOracleResponse(BaseModel):
    project_assessment: str
    tier: str
    strategy: str
    festivals: list[Festival]
    circuit_order: list[str]
    marketing_angle: str
    avoid: list[str]

class AccessResponse(BaseModel):
    mode: str
    output: str

class ChatResponse(BaseModel):
    reply: str
