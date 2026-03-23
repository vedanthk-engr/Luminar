# LUMINARY v2.0 — Neuro-Cinematic Intelligence Platform

## Setup

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Both Together (from root)
```bash
npm install          # installs concurrently
npm run install:all  # installs frontend npm packages
npm run dev          # starts both servers
```

### API Docs
http://localhost:8000/docs  (FastAPI Swagger UI)

### Frontend
http://localhost:5173
