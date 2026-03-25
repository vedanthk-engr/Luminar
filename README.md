## 🎬 What is LUMINARY?

**LUMINARY** is a revolutionary, AI-native cinematic intelligence platform that transforms the entire filmmaking workflow — from ideation to distribution strategy. Unlike traditional filmmaking tools that bolt on AI as an afterthought, LUMINARY was built from the ground up with **three state-of-the-art foundation models** working in concert through a custom-designed **neuro-cinematic reasoning pipeline**.

The platform integrates a **large-scale, purpose-trained machine learning model** that fuses multimodal understanding (vision + language + video) with domain-specific cinematic knowledge spanning cinematography, screenwriting, production planning, emotional storytelling, and global film distribution. Our ML pipeline processes inputs through **multi-step reasoning chains** with structured schema enforcement, enabling outputs with the precision and expertise of Hollywood's top professionals.

> *"LUMINARY doesn't just assist filmmakers — it thinks like a filmmaker."*

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LUMINARY v2.0 PLATFORM                       │
├─────────────────────────┬───────────────────────────────────────────┤
│   REACT 18 FRONTEND     │          FASTAPI BACKEND                  │
│   (Vite + Glassmorphism)│     (Async Python + Vertex AI)            │
│                         │                                           │
│  ┌───────────────────┐  │  ┌─────────────────────────────────────┐  │
│  │  9 Module Pages   │  │  │  AI Service Layer                   │  │
│  │  ─────────────────│  │  │  ┌──────────────────────────────┐   │  │
│  │  • Scene Autopsy  │◄─┼──┤  │ Gemini 2.5 Flash (Text+Vision)│  │  │
│  │  • Script Alchemist│  │  │  │ Imagen 3.0 (Image Gen)      │   │  │
│  │  • Shot Composer  │  │  │  │ Veo 3.0 (Video Gen)          │   │  │
│  │  • VeoPrompt Studio│  │  │  │ Claude Sonnet (Fallback)     │   │  │
│  │  • EmotiCine      │  │  │  └──────────────────────────────┘   │  │
│  │  • Festival Oracle│  │  │                                     │  │
│  │  • CineAccess     │  │  │  ┌──────────────────────────────┐   │  │
│  │  • CineChat       │  │  │  │ Schema-Enforced JSON Pipeline│   │  │
│  │  • CineImage      │  │  │  │ Multi-step Reasoning Chains  │   │  │
│  │  └───────────────┘│  │  │  │ Robust Error Recovery        │   │  │
│  │                   │  │  │  └──────────────────────────────┘   │  │
│  │  Recharts Data Viz│  │  │                                     │  │
│  │  Lucide Icons     │  │  │  9 Specialized API Routers          │  │
│  │  CSS Modules      │  │  │  Pydantic Request/Response Models   │  │
│  └───────────────────┘  │  └─────────────────────────────────────┘  │
├─────────────────────────┴───────────────────────────────────────────┤
│                    GOOGLE CLOUD PLATFORM (Vertex AI)                 │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐     │
│  │ Gemini 2.5   │  │ Imagen 3.0       │  │ Veo 3.0            │     │
│  │ Flash        │  │ Generate-001     │  │ Generate-Preview   │     │
│  │ (Multimodal) │  │ (Photorealistic) │  │ (Cinematic Video)  │     │
│  └──────────────┘  └──────────────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 The ML Pipeline — How It Works

LUMINARY's intelligence is powered by a **custom-designed, large-scale ML pipeline** that goes far beyond simple API calls:

### Multi-Step Reasoning Architecture
1. **Expert System Prompts** — Each of the 9 modules embeds a domain-specific expert persona (e.g., combining Roger Deakins' cinematography expertise with Sidney Lumet's directorial insight and Roland Barthes' semiotic analysis).
2. **Schema-Enforced Structured Output** — All AI responses are constrained through strict JSON schemas with Vertex AI's native `response_schema` parameter, ensuring deterministic, parseable output with zero hallucination in structure.
3. **Multimodal Fusion** — The Scene Autopsy engine processes both visual (base64-encoded frames) and textual inputs through Gemini 2.5 Flash's vision capabilities, performing simultaneous analysis of composition, lighting, color, and narrative.
4. **Prompt Enhancement Pipeline** — The image generation module runs a two-stage pipeline: first generating an enhanced cinematic prompt via Gemini, then passing it to Imagen 3.0 for photorealistic output.
5. **Asynchronous Video Generation** — Veo 3.0 video generation runs as background tasks with real-time progress polling, handling the 2–5 minute render cycle gracefully.
6. **Robust JSON Recovery Engine** — A multi-stage fallback parser handles malformed AI outputs through regex extraction, trailing comma cleanup, newline escaping, and intelligent bracket completion.

### Model Specifications

| Model | Purpose | Parameters | Capabilities |
|-------|---------|------------|-------------|
| **Gemini 2.5 Flash** | Core reasoning engine | Latest-gen multimodal | Text + Vision analysis, structured JSON output, multi-turn chat |
| **Imagen 3.0** (`imagen-3.0-generate-001`) | Photorealistic image generation | State-of-the-art diffusion | Cinematic stills, configurable aspect ratios, safety filtering |
| **Veo 3.0** (`veo-3.0-generate-preview`) | AI video generation | Cutting-edge video diffusion | 4–8 second cinematic clips, 16:9/9:16, async rendering |
| **Claude Sonnet 4** | Fallback reasoning | 200K context | Text/vision analysis, multi-turn conversations |

---

## ✨ The 9 Intelligence Modules

### 🔬 1. Scene Autopsy Engine
**AI-Powered Multimodal Film Scene Analysis**

Upload any film frame or describe a scene — LUMINARY's Scene Autopsy performs a **professional-grade cinematic critique** rivaling industry experts. It analyzes:
- **7 scoring dimensions**: Cinematography, Lighting, Composition, Narrative Power, Emotional Impact, Technical Execution, Color Grade (each scored 0–100)
- Camera angle detection, lens type inference, and depth-of-field analysis
- Lighting setup reconstruction (key light direction, contrast ratios)
- Color palette decoding and its emotional communication
- Director/film reference matching and production era estimation
- Actionable reframing suggestions

> Accepts both **image uploads** (multimodal vision) and **text descriptions**

---

### 📜 2. Script Alchemist
**AI Screenplay & Synopsis Intelligence**

Paste any script, synopsis, or story concept — LUMINARY returns a comprehensive production intelligence report:
- **7-axis scoring**: Audience Engagement, Emotional Depth, Originality, Commercial Viability, Technical Feasibility, Dialogue Quality, Thematic Resonance
- Budget tier estimation (Micro → Blockbuster) with USD ranges
- Genre/subgenre classification with marketable loglines and taglines
- Emotional arc mapping and target audience profiling
- Risk analysis, strength identification, and missing element detection
- Director matching with justification
- Cinematic reference suggestions (e.g., *"Reminiscent of Arrival (2016) meets Ex Machina (2014)"*)

---

### 🎥 3. Shot Composer
**AI Cinematography & Shot List Generator**

Describe a scene — LUMINARY generates a **complete professional shot list** as a master cinematographer would:
- 6–8 precision-engineered shots per scene
- Per-shot specifications: shot type, camera angle, movement, lens choice, lighting setup, duration, and target emotion
- Overall lighting philosophy, sound design notes, and director's note
- Color grade and lens recommendations

---

### 🖼️ 4. CineImage — AI Cinematic Still Generator
**Photorealistic Image Generation via Imagen 3.0**

Generate stunning, **photorealistic cinematic stills** from text descriptions using Google's Imagen 3.0:
- **Two-stage prompt enhancement**: Your idea → Gemini-enhanced cinematic prompt → Imagen 3.0 generation
- Built-in photorealism enforcement (35mm film, Arri Alexa, anamorphic lens keywords)
- Configurable aspect ratios (16:9, 9:16, 1:1, etc.)
- Physical detail injection (skin pores, fabric textures, environmental depth)
- Automatic model fallback (`imagen-3.0-generate-001` → `imagegeneration@006`)
- Result caching for performance optimization

---

### 🎬 5. Veo Video Generation Studio
**AI-Powered Cinematic Video Creation via Veo 3.0**

Generate **short cinematic video clips** directly from text prompts using Google's latest Veo 3.0 model:
- Async job-based architecture with real-time progress polling
- Configurable duration (4, 6, or 8 seconds) and aspect ratio (16:9 / 9:16)
- Background rendering with status endpoint (`/status/{job_id}`)
- Automatic GCP authentication verification
- Base64 video output for seamless frontend integration

---

### ⚡ 6. VeoPrompt Studio
**Multi-Platform AI Video Prompt Engineering**

Transform scene descriptions into **precision-engineered generation prompts** optimized for multiple AI video platforms:
- **Veo 3 prompts** — Ultra-detailed 200–300 word cinematic specifications
- **Runway Gen-3 Alpha prompts** — Concise 80–100 word action-focused prompts
- **Pika Labs prompts** — Compact 60–80 word style-keyword prompts
- Negative prompt generation for artifact avoidance
- Full technical specs: aspect ratio, FPS, resolution, camera motion, lighting style, color grade, film grain, depth of field
- Style references, mood keywords, and generation warnings

---

### 📊 7. EmotiCine Analytics
**Emotional Architecture Visualization Engine**

Map the **complete emotional landscape** of your film across every structural beat:
- 5 emotion channels tracked: Joy, Tension, Fear, Sadness, Surprise
- Interactive area charts with per-scene breakdowns (powered by Recharts)
- Emotion filtering — isolate individual emotions or view the full spectrum
- Scene-by-scene dominant emotion detection
- Peak tension, joy ceiling, and LUMINARY Score computation

---

### 🏆 8. Festival Oracle
**AI Film Festival Submission Strategist**

Generate a **data-driven global festival submission strategy** for your film:
- 8–10 curated festivals spanning every continent (Asia, Europe, Americas, Africa+)
- Per-festival analysis: acceptance probability (0–100%), submission windows, category match, strategy tips
- Tiered classification: A-List, Prestige, Specialty, Regional
- Optimal festival circuit ordering (premiere → secondary → tertiary)
- Marketing angle positioning and festivals to avoid with reasoning

---

### ♿ 9. CineAccess — Inclusive Cinema Engine
**4-Mode Accessibility Content Generator**

Making cinema accessible to **every audience**, LUMINARY generates professional accessibility content in 4 modes:

| Mode | Purpose | Details |
|------|---------|---------|
| 🔊 **Audio Description** | For blind/low-vision viewers | Broadcast-quality narration with spatial details, character actions, atmosphere |
| 🧩 **Cognitive Accessibility** | For neurodivergent audiences | Plain language (max 12 words/sentence), explicit transition labels, step-by-step actions |
| 🌍 **Cultural Intelligence** | For international audiences | Cultural reference explanations, idiom identification, region-specific sensitivity flags |
| 🤟 **Sign Language Adaptation** | For deaf/hard-of-hearing viewers | Intertitle scripts, visual storytelling cues, sign language stage directions |

---

### 💬 Bonus: CineChat — AI Film Expert Companion
**Multi-Turn Conversational Cinema Intelligence**

Chat with an **AI film expert** that combines knowledge of:
- Cinematography, screenwriting, and film theory
- Production planning, budgeting, and scheduling
- Festival strategy and distribution (theatrical, OTT, marketing)
- Indian cinema (Bollywood, Kollywood, Tollywood, Mollywood)
- AI filmmaking tools (Veo 3, Runway, Pika, Sora)
- Film history, movements, and auteur theory

---

## 🛠️ Tech Stack

### Backend
| Technology | Role |
|-----------|------|
| **Python 3.11+** | Backend runtime |
| **FastAPI** | Async REST API framework |
| **Google GenAI SDK** (`google-generativeai`) | Vertex AI integration for Gemini, Imagen, Veo |
| **Anthropic SDK** | Claude Sonnet 4 fallback service |
| **Pydantic v2** | Request/response schema validation |
| **Uvicorn** | ASGI server with hot-reload |
| **Pillow** | Image processing and validation |
| **python-dotenv** | Environment configuration |

### Frontend
| Technology | Role |
|-----------|------|
| **React 18.3** | UI framework with hooks |
| **Vite 5.3** | Next-gen build tool and dev server |
| **React Router v6** | Client-side routing |
| **Recharts 2.12** | Data visualization (EmotiCine charts) |
| **Lucide React** | Premium icon library |
| **Axios** | HTTP client for API calls |
| **CSS Modules** | Scoped component styling |
| **Glassmorphism UI** | Premium dark-mode design system |

### AI / ML Infrastructure
| Technology | Role |
|-----------|------|
| **Google Vertex AI** | Cloud ML platform |
| **Gemini 2.5 Flash** | Core multimodal reasoning model |
| **Imagen 3.0** | Photorealistic image generation |
| **Veo 3.0** | AI video generation |
| **Claude Sonnet 4** | Fallback language model |
| **Custom JSON Schema Pipeline** | Structured output enforcement |

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed
- **Google Cloud Platform** account with Vertex AI enabled
- **GCP Application Default Credentials** configured:
  ```bash
  gcloud auth application-default login
  ```
- (Optional) **Anthropic API Key** for Claude fallback

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/luminary.git
cd luminary
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=us-central1
ALLOWED_ORIGIN=http://localhost:5173
```

> **Note:** GCP authentication is handled via Application Default Credentials (ADC). Run `gcloud auth application-default login` before starting the server.

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

The default `.env` points to:
```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

### 4. Run Both Together (Recommended)
From the project root (`luminary/`):
```bash
npm install          # Installs concurrently
npm run install:all  # Installs frontend packages
npm run dev          # Starts backend + frontend simultaneously
```

### 5. Access the Platform
| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Documentation** (Swagger UI) | http://localhost:8000/docs |
| **Health Check** | http://localhost:8000/health |

---

## 📁 Project Structure

```
luminary/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   ├── routers/
│   │   ├── scene.py             # Scene Autopsy Engine
│   │   ├── script.py            # Script Alchemist
│   │   ├── shots.py             # Shot Composer
│   │   ├── images.py            # CineImage (Imagen 3.0)
│   │   ├── veo_video.py         # Veo 3.0 Video Generation
│   │   ├── veo.py               # VeoPrompt Studio
│   │   ├── festival.py          # Festival Oracle
│   │   ├── access.py            # CineAccess Engine
│   │   └── chat.py              # CineChat
│   ├── services/
│   │   ├── gemini.py            # Gemini + Vertex AI service layer
│   │   └── claude.py            # Claude Sonnet fallback service
│   ├── models/
│   │   ├── requests.py          # Pydantic request schemas
│   │   └── responses.py         # Pydantic response schemas
│   └── utils/
│       └── image.py             # Image validation & encoding
├── frontend/
│   ├── index.html               # App shell with Google Fonts
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   ├── .env.example             # API base URL config
│   └── src/
│       ├── App.jsx              # Root component with routing
│       ├── main.jsx             # React entry point
│       ├── index.css            # Global design system
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx          # Navigation sidebar
│       │   │   ├── Background.jsx       # Animated background
│       │   │   └── FilmTicker.jsx       # Scrolling film ticker
│       │   └── ui/
│       │       ├── GlassCard.jsx        # Glassmorphism card
│       │       ├── ModuleHeader.jsx     # Module page header
│       │       ├── ScoreBar.jsx         # Animated score bar
│       │       ├── ShotCard.jsx         # Shot list card
│       │       ├── CineImage.jsx        # Image generation UI
│       │       ├── LoadingBox.jsx       # Loading state
│       │       └── Spinner.jsx          # Loading spinner
│       ├── pages/
│       │   ├── Home/                    # Landing dashboard
│       │   ├── SceneAutopsy/            # Scene analysis page
│       │   ├── ScriptAlchemist/         # Script analysis page
│       │   ├── ShotComposer/            # Shot list page
│       │   ├── VeoPrompt/               # Prompt engineering page
│       │   ├── EmotiCine/               # Emotion analytics page
│       │   ├── FestivalOracle/          # Festival strategy page
│       │   ├── CineAccess/              # Accessibility page
│       │   └── CineChat/               # AI chat page
│       ├── constants/
│       │   ├── theme.js                 # Design tokens
│       │   ├── tabs.js                  # Navigation config
│       │   ├── emotions.js              # EmotiCine data
│       │   └── samples.js              # Sample data
│       ├── hooks/                       # Custom React hooks
│       └── api/                         # API client layer
└── package.json                         # Root monorepo config
```

---

## 🔑 API Reference

All endpoints are automatically documented at `/docs` (Swagger UI).

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/scene/analyze/image` | Scene Autopsy | Analyze uploaded film frame |
| `POST` | `/api/scene/analyze/text` | Scene Autopsy | Analyze scene from description |
| `POST` | `/api/script/analyze` | Script Alchemist | Analyze screenplay/synopsis |
| `POST` | `/api/shots/compose` | Shot Composer | Generate professional shot list |
| `POST` | `/api/images/generate` | CineImage | Generate photorealistic still |
| `POST` | `/api/veo/generate-video` | Veo Video | Start video generation job |
| `GET`  | `/api/veo/status/{job_id}` | Veo Video | Poll video generation status |
| `POST` | `/api/veo/generate` | VeoPrompt | Generate multi-platform prompts |
| `POST` | `/api/festival/strategy` | Festival Oracle | Generate festival strategy |
| `POST` | `/api/access/generate` | CineAccess | Generate accessibility content |
| `POST` | `/api/chat/message` | CineChat | Send chat message |
| `GET`  | `/health` | System | Health check |

---

## 🎨 Design Philosophy

LUMINARY's interface is built on a **premium dark-mode glassmorphism** design system:

- **Typography**: Cinzel Decorative (headings), Outfit (body), JetBrains Mono (code/data)
- **Color Palette**: Gold accents (`#c8941a`), Crimson alerts (`#c0293a`), Violet highlights (`#6241b5`), Teal accents (`#18a89a`) against deep space backgrounds (`#020208`)
- **Effects**: `backdrop-filter: blur(20px)`, layered glass cards, animated backgrounds, smooth micro-transitions
- **Data Visualization**: Custom-themed Recharts with gradient fills and cinematic color coding

---

## 🏆 Hackathon Highlights

- ✅ **3 Foundation Models** working in concert (Gemini 2.5 Flash + Imagen 3.0 + Veo 3.0)
- ✅ **Large-Scale ML Pipeline** with multi-step reasoning, schema enforcement, and robust recovery
- ✅ **9 Purpose-Built AI Modules** covering the entire filmmaking lifecycle
- ✅ **Multimodal AI** — processes text, images, and generates video
- ✅ **Accessibility-First** — 4-mode inclusive cinema engine (audio, cognitive, cultural, sign language)
- ✅ **Production-Grade Architecture** — async video rendering, error recovery, model fallbacks
- ✅ **Real-World Impact** — empowers independent filmmakers, democratizes cinema intelligence
- ✅ **Full-Stack Implementation** — complete frontend + backend, not just an API

---

## 👥 Team

Built with ❤️ for cinema and AI.

---

## 📄 License

This project was built for hackathon demonstration purposes.

---

<p align="center">
  <strong>✦ LUMINARY v2.0 — Neuro-Cinematic Intelligence ✦</strong>
  <br/>
  <sub>Where artificial intelligence meets the art of cinema.</sub>
</p>
