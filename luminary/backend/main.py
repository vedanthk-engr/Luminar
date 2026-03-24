from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import scene, script, shots, veo, veo_video, festival, access, chat, images

app = FastAPI(
    title="LUMINARY API",
    description="Neuro-Cinematic Intelligence Platform — Backend API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scene.router,    prefix="/api/scene",    tags=["Scene Autopsy"])
app.include_router(script.router,   prefix="/api/script",   tags=["Script Alchemist"])
app.include_router(shots.router,    prefix="/api/shots",    tags=["Shot Composer"])
app.include_router(veo.router,      prefix="/api/veo",      tags=["VeoPrompt Studio"])
app.include_router(veo_video.router,tags=["Veo Video Gen"])
app.include_router(festival.router, prefix="/api/festival", tags=["Festival Oracle"])
app.include_router(access.router,   prefix="/api/access",   tags=["CineAccess"])
app.include_router(chat.router,     prefix="/api/chat",     tags=["CineChat"])
app.include_router(images.router,   tags=["Image Generation"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "LUMINARY API v2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
