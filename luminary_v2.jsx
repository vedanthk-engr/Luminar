import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════
const T = {
  bg:'#020208', bg1:'#05050e', bg2:'#080816',
  glass:'rgba(255,255,255,0.025)', glassMid:'rgba(255,255,255,0.045)', glassHi:'rgba(255,255,255,0.07)',
  border:'rgba(255,255,255,0.05)', borderHi:'rgba(255,255,255,0.12)',
  gold:'#c8941a', goldL:'#e4ae35', goldGlow:'rgba(200,148,26,0.15)',
  crimson:'#c0293a', crimsonL:'#e03348', crimsonGlow:'rgba(192,41,58,0.14)',
  teal:'#18a89a', tealL:'#24c4b5', tealGlow:'rgba(24,168,154,0.14)',
  violet:'#6241b5', violetL:'#8460d8', violetGlow:'rgba(98,65,181,0.14)',
  sky:'#2876c9', skyL:'#3d96ea', skyGlow:'rgba(40,118,201,0.14)',
  green:'#17a361', red:'#d44050', amber:'#c97a18',
  text:'#d8e6f4', muted:'#6e8aa0', dim:'#354555',
};

const MODEL = "claude-sonnet-4-20250514";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:rgba(200,148,26,0.2);border-radius:2px}
textarea,input{font-family:'Outfit',sans-serif;outline:none;resize:none}
button{cursor:pointer;font-family:'Outfit',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(70px,-50px) scale(1.1)}70%{transform:translate(-30px,40px) scale(0.9)}}
@keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-60px,70px)}}
@keyframes orb3{0%,100%{transform:translate(0,0)}60%{transform:translate(50px,-40px)}}
@keyframes filmRoll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes glowGold{0%,100%{box-shadow:0 0 20px rgba(200,148,26,0.2)}50%{box-shadow:0 0 45px rgba(200,148,26,0.5)}}
@keyframes dot{0%,80%,100%{transform:scale(0.8);opacity:0.3}40%{transform:scale(1.3);opacity:1}}
@keyframes scan{0%{top:-2px;opacity:0.7}100%{top:100%;opacity:0}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes frameFlash{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes stagger1{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
`;

// ═══════════════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════════════
async function callClaude(system, userText, imageData=null) {
  const content = imageData
    ? [{ type:"image", source:{ type:"base64", media_type:imageData.type, data:imageData.b64 }}, { type:"text", text:userText }]
    : userText;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:MODEL, max_tokens:1200, system, messages:[{role:"user",content}] })
    });
    const d = await r.json();
    return d.content?.[0]?.text || "";
  } catch(e){ return "API error: "+e.message; }
}

async function callClaudeChat(system, history) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:MODEL, max_tokens:1000, system, messages:history })
    });
    const d = await r.json();
    return d.content?.[0]?.text || "";
  } catch(e){ return "API error: "+e.message; }
}

function toBase64(file) {
  return new Promise((res,rej) => {
    const r = new FileReader();
    r.onload = () => res({ b64:r.result.split(",")[1], type:file.type });
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function ModuleHeader({ badge, color, number, title, sub }) {
  return (
    <header style={{ marginBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <div style={{ fontSize:9, color, letterSpacing:3.5, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>✦ MODULE {number}</div>
        <div style={{ height:1, flex:1, background:`linear-gradient(90deg, ${color}44, transparent)` }}/>
      </div>
      <h2 style={{ fontSize:34, fontWeight:800, fontFamily:"'Cinzel Decorative',serif", color:T.text, marginBottom:10, letterSpacing:1 }}>{title}</h2>
      <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, maxWidth:680 }}>{sub}</p>
    </header>
  );
}

function ScoreBar({ label, val, color, delay=0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setW(val), 100+delay); return()=>clearTimeout(t); },[val]);
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:T.muted }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color, fontFamily:"'Cinzel Decorative',serif" }}>{val}</span>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.04)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg,${color}66,${color})`, borderRadius:2, transition:"width 1.1s cubic-bezier(0.22,1,0.36,1)" }}/>
      </div>
    </div>
  );
}

function GlassCard({ children, style={}, accent=null, onClick=null }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.glass, border:`1px solid ${hov && accent ? accent+"44" : T.border}`,
        borderRadius:16, transition:"all 0.2s", transform: hov && onClick ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

function Spinner({ color=T.gold }) {
  return <div style={{ width:38, height:38, borderRadius:"50%", border:`2.5px solid ${color}`, borderTopColor:"transparent", animation:"spin 0.7s linear infinite" }}/>;
}

function LoadingBox({ label, color=T.gold, steps=[] }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:320, gap:16 }}>
      <Spinner color={color}/>
      <div style={{ fontSize:13, color:T.muted }}>{label}</div>
      {steps.map((s,i)=><div key={s} style={{ fontSize:11, color:T.dim, animation:`pulse 2s ${i*0.35}s ease-in-out infinite` }}>— {s}</div>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// BACKGROUND & CHROME
// ═══════════════════════════════════════════════════════════════════════
function Background() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", inset:0, background:`
        radial-gradient(ellipse 70% 60% at 15% 10%, rgba(98,65,181,0.07) 0%, transparent 65%),
        radial-gradient(ellipse 60% 50% at 88% 80%, rgba(200,148,26,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 50% 45% at 55% 45%, rgba(24,168,154,0.04) 0%, transparent 55%),
        radial-gradient(ellipse 40% 35% at 30% 70%, rgba(192,41,58,0.04) 0%, transparent 55%)` }}/>
      {[[700,700,-250,-120,"rgba(98,65,181,0.065)","orb1 24s"],
        [580,580,-150,-120,"rgba(200,148,26,0.055)","orb2 30s"],
        [420,420,200,300,"rgba(24,168,154,0.045)","orb3 19s 8s"]].map(([w,h,t,l,c,a],i)=>(
        <div key={i} style={{ position:"absolute", width:w, height:h, borderRadius:"50%", top:t, left:l,
          background:`radial-gradient(circle, ${c} 0%, transparent 65%)`, animation:`${a} ease-in-out infinite` }}/>
      ))}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.03 }}>
        <filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 85% at 50% 50%, transparent 45%, rgba(2,2,8,0.55) 100%)" }}/>
    </div>
  );
}

function FilmTicker() {
  const items = ["LUMINARY v2","SCENE AUTOPSY","SHOT COMPOSER","FESTIVAL ORACLE","VEO3 STUDIO","EMOTI CINE","SCRIPT ALCHEMIST","CINEACCESS","CINECHAT","CODEFLIX 2026","VIT CHENNAI","OPEN INNOVATION"];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"9px 0", background:"rgba(2,2,8,0.6)" }}>
      <div style={{ display:"flex", animation:"filmRoll 20s linear infinite", width:"max-content" }}>
        {[...items,...items].map((l,i)=>(
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:14, paddingRight:20 }}>
            <span style={{ display:"inline-block", width:14, height:14, borderRadius:3, border:`1.5px solid ${T.dim}`, opacity:0.4, animation:`frameFlash 3s ${i*0.2}s ease-in-out infinite` }}/>
            <span style={{ fontSize:9, letterSpacing:3.5, color:T.dim, fontFamily:"'Cinzel Decorative',serif" }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════
const TABS = [
  { id:"home",     icon:"⬡",  label:"Overview",        sub:"Platform Home",      color:T.gold },
  { id:"scene",    icon:"🎬", label:"Scene Autopsy",   sub:"Vision AI Critique", color:T.crimsonL },
  { id:"script",   icon:"⚗️",  label:"Script Alchemist",sub:"Deep NLP Analysis",  color:T.gold },
  { id:"emotion",  icon:"🧠", label:"EmotiCine",       sub:"Emotion Waveforms",   color:T.violetL },
  { id:"shots",    icon:"🎥", label:"Shot Composer",   sub:"AI Pre-Viz Studio",  color:T.skyL },
  { id:"veo",      icon:"✨", label:"VeoPrompt Studio",sub:"Gen-Video Engineering",color:T.tealL },
  { id:"festival", icon:"🏆", label:"Festival Oracle", sub:"Submission Strategy",color:T.amber },
  { id:"access",   icon:"♿", label:"CineAccess",      sub:"Universal Design",    color:T.teal },
  { id:"chat",     icon:"💬", label:"CineChat AI",     sub:"Cinema Expert",       color:T.sky },
];

function Sidebar({ tab, setTab }) {
  return (
    <aside style={{ width:230, position:"fixed", left:0, top:0, bottom:0, zIndex:200,
      background:"rgba(2,2,8,0.97)", borderRight:`1px solid ${T.border}`,
      backdropFilter:"blur(20px)", display:"flex", flexDirection:"column" }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 18px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:34, height:34, borderRadius:9,
            background:`linear-gradient(135deg, ${T.gold}, ${T.violet})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✦</div>
          <div>
            <div style={{ fontSize:13, fontFamily:"'Cinzel Decorative',serif", color:T.text, letterSpacing:2.5, fontWeight:700 }}>LUMINARY</div>
            <div style={{ fontSize:9, color:T.muted, letterSpacing:2, marginTop:1 }}>CINEMA AI v2.0</div>
          </div>
        </div>
        <div style={{ background:"linear-gradient(135deg,rgba(200,148,26,0.1),rgba(98,65,181,0.07))",
          border:"1px solid rgba(200,148,26,0.2)", borderRadius:9, padding:"8px 12px" }}>
          <div style={{ fontSize:8.5, color:T.gold, letterSpacing:3, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>CODEFLIX 2026</div>
          <div style={{ fontSize:11, color:T.goldL, fontWeight:700, marginTop:3 }}>TRACK 5 · OPEN INNOVATION</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ fontSize:8.5, color:T.dim, letterSpacing:2.5, fontWeight:700, padding:"4px 10px 10px" }}>9 AI MODULES</div>
        {TABS.map(t=>{
          const active = tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:9,
                border:"none", background:active ? `linear-gradient(135deg,${t.color}14,${t.color}07)` : "transparent",
                borderLeft:`2px solid ${active ? t.color : "transparent"}`, textAlign:"left", width:"100%", transition:"all 0.15s" }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=T.glass; }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:15, minWidth:20, textAlign:"center" }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:11.5, fontWeight:active?700:500, color:active?t.color:T.muted }}>{t.label}</div>
                <div style={{ fontSize:9.5, color:T.dim, marginTop:1 }}>{t.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div style={{ padding:"14px 20px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontSize:9.5, color:T.dim, lineHeight:1.8 }}>Claude Sonnet API · Real AI<br/>No fake/hardcoded outputs<br/>VIT Chennai · March 23–27</div>
        <div style={{ marginTop:8, display:"flex", gap:4, flexWrap:"wrap" }}>
          {["AI","Vision","NLP","GenAI","RAG"].map(x=>(
            <span key={x} style={{ fontSize:8.5, color:T.violet, background:"rgba(98,65,181,0.1)",
              border:"1px solid rgba(98,65,181,0.18)", borderRadius:4, padding:"1.5px 5px", fontWeight:700 }}>{x}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════
function HomePage({ setTab }) {
  const modules = [
    { id:"scene", icon:"🎬", color:T.crimsonL, glow:T.crimsonGlow, title:"Scene Autopsy",
      desc:"Upload any movie still or scene screenshot. Claude Vision dissects cinematography, lighting, composition, narrative power, and emotional impact — returning a full professional film critic analysis with animated scores." },
    { id:"script", icon:"⚗️", color:T.gold, glow:T.goldGlow, title:"Script Alchemist",
      desc:"AI-powered screenplay intelligence. Paste any script or synopsis for genre classification, emotional arc mapping, budget estimation, production risk analysis, and a full director's brief." },
    { id:"shots", icon:"🎥", color:T.skyL, glow:T.skyGlow, title:"Shot Composer",
      desc:"Describe a scene in plain language. AI generates a complete professional shot list with camera angles, lens choices, movements, lighting setups, and color grade direction — visualized as a storyboard." },
    { id:"veo", icon:"✨", color:T.tealL, glow:T.tealGlow, title:"VeoPrompt Studio",
      desc:"Engineer precision prompts for Veo3, Runway Gen-3, and Pika Labs. AI transforms your vision into structured generation prompts with camera specs, motion language, and cinematic style parameters." },
    { id:"emotion", icon:"🧠", color:T.violetL, glow:T.violetGlow, title:"EmotiCine Analytics",
      desc:"Map emotional intensity across every scene — joy, tension, fear, sadness, surprise — as cinematic waveforms. Identify audience resonance peaks and structural arc patterns before a frame is shot." },
    { id:"festival", icon:"🏆", color:T.amber, glow:T.goldGlow, title:"Festival Oracle",
      desc:"AI-powered festival submission strategy. Input your film's details and get matched to optimal festivals with acceptance probability scores, submission tips, and global circuit roadmaps." },
    { id:"access", icon:"♿", color:T.teal, glow:T.tealGlow, title:"CineAccess",
      desc:"Break every barrier. AI generates professional audio descriptions, cognitive-friendly scripts, and cultural adaptation notes — making your film accessible to 2.2 billion people globally." },
    { id:"chat", icon:"💬", color:T.skyL, glow:T.skyGlow, title:"CineChat AI",
      desc:"Your always-on cinema intelligence. Script structure, cinematography theory, distribution strategy, Indian cinema, AI in filmmaking — real multi-turn conversation with a master film expert." },
  ];
  const stats = [
    { v:"9", l:"AI Modules", c:T.gold },
    { v:"Real", l:"Claude Vision API", c:T.crimsonL },
    { v:"2.2B", l:"Accessibility Impact", c:T.teal },
    { v:"Veo3", l:"Gen-Video Ready", c:T.tealL },
    { v:"100%", l:"Live AI Outputs", c:T.violetL },
    { v:"0", l:"Fake/Hardcoded AI", c:T.muted },
  ];
  return (
    <div style={{ animation:"fadeUp 0.5s ease forwards" }}>
      {/* Hero */}
      <div style={{ textAlign:"center", padding:"48px 48px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", left:0, right:0, height:2,
            background:`linear-gradient(90deg,transparent,${T.gold}44,${T.violet}44,transparent)`,
            animation:"scan 10s linear infinite" }}/>
        </div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8,
          background:"linear-gradient(135deg,rgba(200,148,26,0.1),rgba(98,65,181,0.07))",
          border:"1px solid rgba(200,148,26,0.22)", borderRadius:20, padding:"6px 18px", marginBottom:24 }}>
          <span style={{ fontSize:9, color:T.gold, letterSpacing:4, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>
            ✦ OPEN INNOVATION · TRACK 5 · CODEFLIX 2026
          </span>
        </div>
        <h1 style={{ fontSize:52, fontWeight:900, lineHeight:1.05, fontFamily:"'Cinzel Decorative',serif",
          background:`linear-gradient(135deg, ${T.text} 0%, ${T.goldL} 40%, ${T.violetL} 80%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          marginBottom:18, letterSpacing:0.5 }}>
          The World's First<br/>Neuro-Cinematic<br/>Intelligence Platform
        </h1>
        <p style={{ fontSize:15, color:T.muted, maxWidth:580, margin:"0 auto 34px", lineHeight:1.8 }}>
          <strong style={{ color:T.text }}>LUMINARY v2.0</strong> — Nine AI-powered modules unifying scene vision analysis,
          script intelligence, generative pre-viz, emotion analytics, universal accessibility,
          and festival strategy. Real APIs. Real outputs. Real innovation.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {[{l:"🎬 Scene Autopsy",id:"scene",p:true},{l:"⚗️ Script Analysis",id:"script",p:false},{l:"✨ VeoPrompt",id:"veo",p:false},{l:"🏆 Festival Oracle",id:"festival",p:false}].map(b=>(
            <button key={b.id} onClick={()=>setTab(b.id)}
              style={{ background:b.p?`linear-gradient(135deg,${T.gold},#a07010)`:"rgba(255,255,255,0.04)",
                color:b.p?"#000":T.muted, border:b.p?"none":`1px solid ${T.border}`,
                borderRadius:11, padding:"12px 22px", fontSize:13, fontWeight:700, transition:"all 0.2s",
                animation:b.p?"glowGold 3s ease-in-out infinite":"none" }}>
              {b.l}
            </button>
          ))}
        </div>
      </div>
      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, padding:"0 40px 28px" }}>
        {stats.map(s=>(
          <GlassCard key={s.l} style={{ padding:"16px 12px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:"'Cinzel Decorative',serif" }}>{s.v}</div>
            <div style={{ fontSize:10, color:T.muted, marginTop:4 }}>{s.l}</div>
          </GlassCard>
        ))}
      </div>
      {/* Module grid */}
      <div style={{ padding:"0 40px 48px" }}>
        <div style={{ fontSize:9, color:T.dim, letterSpacing:3, fontWeight:700, marginBottom:16 }}>PLATFORM MODULES — CLICK TO EXPLORE</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {modules.map(m=>(
            <GlassCard key={m.id} accent={m.color} onClick={()=>setTab(m.id)} style={{ padding:"24px" }}>
              <div style={{ position:"absolute", top:-50, right:-50, width:140, height:140, borderRadius:"50%",
                background:`radial-gradient(circle,${m.glow} 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ fontSize:28, marginBottom:12 }}>{m.icon}</div>
              <div style={{ fontSize:13.5, fontWeight:700, color:m.color, marginBottom:7, fontFamily:"'Outfit',sans-serif" }}>{m.title}</div>
              <div style={{ fontSize:12.5, color:T.muted, lineHeight:1.75 }}>{m.desc}</div>
              <div style={{ marginTop:14, fontSize:11, color:m.color, fontWeight:600 }}>Launch module →</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SCENE AUTOPSY — flagship module
// ═══════════════════════════════════════════════════════════════════════
const AUTOPSY_SYS = `You are LUMINARY Scene Autopsy Engine — the world's most advanced AI film critic with expertise across cinematography, narrative theory, visual semiotics, and emotional psychology.

Analyze the provided film scene image with the eye of Roger Deakins (cinematography), Sidney Lumet (direction), and Roland Barthes (semiotics).

Return ONLY a valid JSON object — no markdown, no extra text:
{
  "title": "Inferred film title or 'Untitled Scene'",
  "overall_score": 0-100,
  "verdict": "2-sentence powerful professional verdict from a film critic's perspective",
  "cinematography": 0-100,
  "lighting": 0-100,
  "composition": 0-100,
  "narrative_power": 0-100,
  "emotional_impact": 0-100,
  "technical_execution": 0-100,
  "color_grade": 0-100,
  "scene_type": "e.g. Establishing Shot / Climax / Exposition / Action / Emotional Beat",
  "dominant_emotion": "e.g. Dread / Hope / Isolation / Joy",
  "camera_analysis": "Technical camera observation: angle, lens type, depth of field, movement implied",
  "lighting_analysis": "Describe the lighting setup: key light direction, contrast ratio, mood it creates",
  "color_palette": "Describe the color story and what it communicates emotionally",
  "narrative_function": "What story role does this scene play? What does it advance?",
  "strengths": ["strength 1","strength 2","strength 3"],
  "improvements": ["improvement 1","improvement 2","improvement 3"],
  "reference_directors": ["Director (Film)","Director (Film)"],
  "production_era_guess": "e.g. 2010s Hollywood / 2000s European Art House / Contemporary South Asian",
  "reframe_suggestion": "A specific, actionable suggestion to improve the shot composition or framing"
}`;

const SAMPLE_DESCRIPTIONS = [
  "A lone figure standing in a rain-soaked alley at night, illuminated by a single neon sign, casting long red shadows.",
  "Two characters face each other across a wide empty table in a boardroom. One is backlit by a massive window.",
  "A child runs through a golden wheat field at sunset, arms outstretched. Camera tracks at ground level."
];

function SceneAutopsy() {
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("upload"); // upload | describe
  const dropRef = useRef();

  const handleFile = async f => {
    if (!f || !f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    const b64 = await toBase64(f);
    setImg(b64);
    setResult(null); setError("");
  };

  const onDrop = e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const analyze = async () => {
    setLoading(true); setResult(null); setError("");
    let raw;
    if (mode === "upload" && img) {
      raw = await callClaude(AUTOPSY_SYS, "Analyze this film scene image with full professional critique.", img);
    } else {
      raw = await callClaude(AUTOPSY_SYS, `Analyze this described film scene as if you are watching it: "${desc}"`);
    }
    try {
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch { setError("Parse error. Raw: "+raw.slice(0,300)); }
    setLoading(false);
  };

  const scoreItems = result ? [
    { l:"Cinematography",      v:result.cinematography,       c:T.gold },
    { l:"Lighting Design",     v:result.lighting,             c:T.amber },
    { l:"Composition",         v:result.composition,          c:T.crimsonL },
    { l:"Narrative Power",     v:result.narrative_power,      c:T.violetL },
    { l:"Emotional Impact",    v:result.emotional_impact,     c:T.skyL },
    { l:"Technical Execution", v:result.technical_execution,  c:T.tealL },
    { l:"Color Grade",         v:result.color_grade,          c:T.green },
  ] : [];

  const radarData = result ? [
    { subject:"Cinemat.", A:result.cinematography },
    { subject:"Lighting", A:result.lighting },
    { subject:"Composition", A:result.composition },
    { subject:"Narrative", A:result.narrative_power },
    { subject:"Emotion", A:result.emotional_impact },
    { subject:"Color", A:result.color_grade },
  ] : [];

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader badge="SCENE AUTOPSY" color={T.crimsonL} number="01" title="Scene Autopsy"
        sub="Upload a movie still or scene screenshot — or describe a scene — and LUMINARY's Vision AI delivers a frame-by-frame professional film critic analysis: cinematography breakdown, lighting dissection, narrative function, emotional palette, and specific improvement suggestions." />

      {/* Mode switch */}
      <div style={{ display:"flex", gap:8, marginBottom:22 }}>
        {[{id:"upload",l:"📎 Upload Scene Image"},{id:"describe",l:"✏️ Describe a Scene"}].map(m=>(
          <button key={m.id} onClick={()=>{ setMode(m.id); setResult(null); setError(""); }}
            style={{ padding:"9px 18px", borderRadius:9, border:`1px solid ${mode===m.id ? T.crimsonL+"66" : T.border}`,
              background:mode===m.id?"rgba(192,41,58,0.1)":T.glass,
              color:mode===m.id?T.crimsonL:T.muted, fontSize:12.5, fontWeight:600, transition:"all 0.15s" }}>
            {m.l}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22, alignItems:"start" }}>
        {/* LEFT */}
        <div>
          {mode==="upload" ? (
            <>
              <div ref={dropRef} onDrop={onDrop} onDragOver={e=>e.preventDefault()}
                onClick={()=>document.getElementById("fileIn").click()}
                style={{ border:`2px dashed ${preview ? T.crimsonL+"55" : T.border}`,
                  borderRadius:14, minHeight:240, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center", cursor:"pointer",
                  background:preview?"transparent":T.glass, overflow:"hidden", position:"relative", transition:"all 0.2s" }}
                onMouseEnter={e=>{ if(!preview) e.currentTarget.style.borderColor=T.crimsonL+"44"; }}
                onMouseLeave={e=>{ if(!preview) e.currentTarget.style.borderColor=T.border; }}>
                {preview
                  ? <img src={preview} alt="Scene" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:12 }}/>
                  : <>
                      <div style={{ fontSize:38, opacity:0.2, marginBottom:12 }}>🎬</div>
                      <div style={{ fontSize:13, color:T.muted, textAlign:"center" }}>Drop scene image here<br/>or click to browse</div>
                      <div style={{ fontSize:11, color:T.dim, marginTop:8 }}>JPG · PNG · WEBP · Up to 20MB</div>
                    </>
                }
                <input id="fileIn" type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
              </div>
              {preview && (
                <button onClick={()=>{ setPreview(null); setImg(null); setResult(null); }}
                  style={{ marginTop:8, background:"transparent", border:`1px solid ${T.border}`,
                    color:T.muted, borderRadius:8, padding:"6px 14px", fontSize:11 }}>
                  × Clear image
                </button>
              )}
            </>
          ) : (
            <>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)}
                placeholder={"Describe your scene in vivid detail...\n\nExample:\nA detective sits alone at a cluttered desk, backlit by the only lamp in the room. Rain streaks the window behind her. She holds a photograph, her face half in shadow."}
                style={{ width:"100%", height:240, background:T.glass, border:`1px solid ${T.border}`,
                  borderRadius:12, color:T.text, fontSize:13, padding:"16px", lineHeight:1.8,
                  fontFamily:"'Outfit',sans-serif", transition:"border 0.2s" }}
                onFocus={e=>e.target.style.borderColor=T.crimsonL+"55"}
                onBlur={e=>e.target.style.borderColor=T.border}/>
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:8 }}>SAMPLE SCENES</div>
                {SAMPLE_DESCRIPTIONS.map((s,i)=>(
                  <button key={i} onClick={()=>setDesc(s)}
                    style={{ display:"block", width:"100%", textAlign:"left", marginBottom:5,
                      background:T.glass, border:`1px solid ${T.border}`, borderRadius:8,
                      padding:"9px 12px", color:T.muted, fontSize:11, lineHeight:1.5, transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.crimsonL+"44"; e.currentTarget.style.color=T.text; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
                    <span style={{ color:T.crimsonL, marginRight:7 }}>▶</span>{s.slice(0,75)}...
                  </button>
                ))}
              </div>
            </>
          )}
          <button onClick={analyze} disabled={loading || (mode==="upload"?!img:!desc.trim())}
            style={{ marginTop:14, width:"100%",
              background:(mode==="upload"?img:desc.trim())&&!loading
                ?`linear-gradient(135deg,${T.crimsonL},#8a1525)` : "rgba(255,255,255,0.04)",
              color:(mode==="upload"?img:desc.trim())&&!loading?"#fff":T.dim,
              border:"none", borderRadius:12, padding:"14px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading ? "⚙️  Analyzing with Vision AI..." : "🎬  Run Scene Autopsy"}
          </button>
        </div>

        {/* RIGHT */}
        <div>
          {!result && !loading && !error && (
            <GlassCard style={{ minHeight:440, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:40 }}>
              <div style={{ fontSize:52, opacity:0.1 }}>🎬</div>
              <div style={{ fontSize:13, color:T.dim, textAlign:"center", lineHeight:1.7 }}>
                Upload a scene image or describe one<br/>to receive a full professional film critique
              </div>
            </GlassCard>
          )}
          {loading && (
            <GlassCard style={{ minHeight:440 }}>
              <LoadingBox color={T.crimsonL} label="Analyzing scene with Vision AI..."
                steps={["Reading visual composition","Analyzing light sources","Mapping color palette","Evaluating narrative function","Scoring cinematic elements"]}/>
            </GlassCard>
          )}
          {error && <div style={{ color:T.red, fontSize:12, padding:16, background:"rgba(212,64,80,0.08)", borderRadius:12, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
          {result && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* Verdict */}
              <GlassCard style={{ padding:"20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:16, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>{result.title}</div>
                    <div style={{ display:"flex", gap:8, marginTop:6 }}>
                      {[result.scene_type, result.dominant_emotion, result.production_era_guess].filter(Boolean).slice(0,2).map(x=>(
                        <span key={x} style={{ fontSize:10, color:T.muted, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:5, padding:"2px 8px" }}>{x}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:32, fontWeight:900, color:result.overall_score>=80?T.gold:result.overall_score>=60?T.amber:T.red, fontFamily:"'Cinzel Decorative',serif", lineHeight:1 }}>{result.overall_score}</div>
                    <div style={{ fontSize:9, color:T.muted, marginTop:2 }}>LUMINARY SCORE</div>
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:T.muted, fontStyle:"italic", lineHeight:1.8, paddingTop:10, borderTop:`1px solid ${T.border}` }}>"{result.verdict}"</div>
              </GlassCard>

              {/* Scores + Radar */}
              <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:12 }}>
                <GlassCard style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:14 }}>CINEMATIC SCORES</div>
                  {scoreItems.map((s,i)=><ScoreBar key={s.l} label={s.l} val={s.v} color={s.c} delay={i*80}/>)}
                </GlassCard>
                <GlassCard style={{ padding:"14px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:4 }}>RADAR</div>
                  <ResponsiveContainer width="100%" height={170}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)"/>
                      <PolarAngleAxis dataKey="subject" tick={{ fill:T.dim, fontSize:9 }}/>
                      <Radar dataKey="A" stroke={T.crimsonL} fill={T.crimsonL} fillOpacity={0.15} strokeWidth={1.5}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              {/* Analysis panels */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { l:"CAMERA ANALYSIS", v:result.camera_analysis, c:T.gold },
                  { l:"LIGHTING DESIGN", v:result.lighting_analysis, c:T.amber },
                  { l:"COLOR STORY", v:result.color_palette, c:T.tealL },
                  { l:"NARRATIVE FUNCTION", v:result.narrative_function, c:T.violetL },
                ].map(p=>(
                  <div key={p.l} style={{ background:`${p.c}0a`, border:`1px solid ${p.c}22`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:9, color:p.c, letterSpacing:2, fontWeight:700, marginBottom:7 }}>{p.l}</div>
                    <div style={{ fontSize:12, color:T.muted, lineHeight:1.7 }}>{p.v}</div>
                  </div>
                ))}
              </div>

              {/* Strengths / Improvements */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <GlassCard style={{ padding:"14px" }}>
                  <div style={{ fontSize:9, color:T.green, letterSpacing:2, fontWeight:700, marginBottom:10 }}>✦ STRENGTHS</div>
                  {(result.strengths||[]).map((s,i)=>(
                    <div key={i} style={{ fontSize:12, color:T.muted, marginBottom:7, display:"flex", gap:7, lineHeight:1.6 }}>
                      <span style={{ color:T.green, flexShrink:0 }}>✓</span>{s}
                    </div>
                  ))}
                </GlassCard>
                <GlassCard style={{ padding:"14px" }}>
                  <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700, marginBottom:10 }}>⚡ WHERE TO IMPROVE</div>
                  {(result.improvements||[]).map((s,i)=>(
                    <div key={i} style={{ fontSize:12, color:T.muted, marginBottom:7, display:"flex", gap:7, lineHeight:1.6 }}>
                      <span style={{ color:T.amber, flexShrink:0 }}>!</span>{s}
                    </div>
                  ))}
                </GlassCard>
              </div>

              {/* Reframe suggestion */}
              {result.reframe_suggestion && (
                <div style={{ background:"rgba(98,65,181,0.07)", border:"1px solid rgba(98,65,181,0.2)", borderRadius:12, padding:"14px 18px" }}>
                  <div style={{ fontSize:9, color:T.violetL, letterSpacing:2, fontWeight:700, marginBottom:7 }}>🎥 DIRECTOR'S REFRAME SUGGESTION</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.75 }}>{result.reframe_suggestion}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SCRIPT ALCHEMIST
// ═══════════════════════════════════════════════════════════════════════
const SCRIPT_SYS = `You are LUMINARY Script Intelligence — an elite AI that combines a Hollywood script doctor, behavioral economist, and cinematography master.
Analyze the script/synopsis and return ONLY valid JSON:
{
  "title":"inferred or Untitled","genre":"primary genre","subgenre":"secondary genre",
  "logline":"one compelling sentence",
  "scores":{"audience_engagement":0-100,"emotional_depth":0-100,"originality":0-100,"commercial_viability":0-100,"technical_feasibility":0-100,"dialogue_quality":0-100,"thematic_resonance":0-100},
  "budget_tier":"Micro / Low / Mid / High / Blockbuster",
  "estimated_budget_usd":"e.g. $500K–$2M",
  "target_audience":"2 sentences",
  "emotional_arc":"brief arc description",
  "risks":["r1","r2","r3"],
  "strengths":["s1","s2","s3"],
  "missing_elements":["m1","m2"],
  "cinematic_references":["Film (Year)","Film (Year)"],
  "director_match":["Director name — why"],
  "recommendation":"2-3 sentence actionable production brief",
  "tagline":"A marketable tagline for this project"
}`;

const SAMPLES = [
  { l:"Sci-Fi Thriller", t:`EXT. ABANDONED SPACE STATION - 2094\nDr. ANANYA KRISHNAN floats through a dead corridor. Oxygen: 12 minutes. She finds a child's crayon drawing taped to the wall — stars and a smiling sun.\nANANYA (radio): Command, they were alive. Why didn't they make it back?` },
  { l:"Family Drama", t:`INT. ANCESTRAL HOME - KERALA - DUSK\nRAJAN (72) sits where four generations ate. His daughter PRIYA (42) tells him the house must be sold to pay debts. Outside, monsoon rain hammers the courtyard where Rajan taught her to catch raindrops in her palms, fifty years ago.` },
  { l:"AI Crime Thriller", t:`Street-level Mumbai cop VIKRAM (29) discovers the serial killer he's tracking uses AI trained on police data. The department is compromised. 48 hours. No one to trust.` },
];

function ScriptAlchemist() {
  const [txt, setTxt] = useState(""); const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null); const [err, setErr] = useState("");

  const analyze = async () => {
    setLoading(true); setRes(null); setErr("");
    const raw = await callClaude(SCRIPT_SYS, txt);
    try { setRes(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setErr("Parse error: "+raw.slice(0,200)); }
    setLoading(false);
  };

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.gold} number="02" title="Script Alchemist"
        sub="Paste any screenplay, synopsis, or scene. LUMINARY returns genre classification, emotional arc analysis, budget estimation, production risk assessment, cinematic DNA references, and a full director's brief — all powered by real NLP intelligence."/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22, alignItems:"start" }}>
        <div>
          <textarea value={txt} onChange={e=>setTxt(e.target.value)}
            placeholder={"FADE IN:\n\nEXT. ROOFTOP - NIGHT\n\nPaste script, scene, or synopsis..."}
            style={{ width:"100%", height:320, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:14, color:T.text, fontSize:13, padding:"16px", lineHeight:1.8,
              fontFamily:"'JetBrains Mono',monospace", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=T.gold+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={analyze} disabled={loading||!txt.trim()}
            style={{ marginTop:12, width:"100%",
              background:txt.trim()&&!loading?`linear-gradient(135deg,${T.gold},#906010)`:"rgba(255,255,255,0.04)",
              color:txt.trim()&&!loading?"#000":T.dim, border:"none", borderRadius:12,
              padding:"14px", fontSize:14, fontWeight:700, transition:"all 0.2s",
              animation:txt.trim()&&!loading?"glowGold 3s ease-in-out infinite":"none" }}>
            {loading?"⚙️  Processing intelligence...":"⚗️  Run Full Script Analysis"}
          </button>
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>LOAD SAMPLE</div>
            {SAMPLES.map(s=>(
              <button key={s.l} onClick={()=>setTxt(s.t)}
                style={{ display:"block", width:"100%", textAlign:"left", marginBottom:5,
                  background:T.glass, border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"10px 13px", color:T.muted, fontSize:12, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.gold+"44"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
                <span style={{ color:T.gold, marginRight:7 }}>▶</span>{s.l}
              </button>
            ))}
          </div>
        </div>
        <div>
          {!res&&!loading&&!err && (
            <GlassCard style={{ minHeight:440, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <div style={{ fontSize:48, opacity:0.1 }}>⚗️</div>
              <div style={{ fontSize:13, color:T.dim }}>Results will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:440 }}><LoadingBox color={T.gold} label="Processing screenplay intelligence..." steps={["Reading narrative structure","Mapping emotional arcs","Evaluating risk factors","Matching cinematic DNA","Compiling director brief"]}/></GlassCard>}
          {res && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <GlassCard style={{ padding:"18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>{res.title}</div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{res.genre}{res.subgenre?` · ${res.subgenre}`:""} · {res.budget_tier} · {res.estimated_budget_usd}</div>
                    {res.tagline && <div style={{ fontSize:12, color:T.gold, fontStyle:"italic", marginTop:6 }}>"{res.tagline}"</div>}
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:28, fontWeight:900, color:T.gold, fontFamily:"'Cinzel Decorative',serif" }}>{res.scores?.audience_engagement}</div>
                    <div style={{ fontSize:9, color:T.muted }}>ENGAGEMENT</div>
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:T.muted, fontStyle:"italic", lineHeight:1.75, paddingTop:10, borderTop:`1px solid ${T.border}` }}>"{res.logline}"</div>
              </GlassCard>
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:14 }}>INTELLIGENCE SCORES</div>
                {Object.entries(res.scores||{}).map(([k,v],i)=>(
                  <ScoreBar key={k} label={k.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                    val={v} color={[T.gold,T.violetL,T.tealL,T.skyL,T.crimsonL,T.amber,T.green][i%7]} delay={i*60}/>
                ))}
              </GlassCard>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:"rgba(23,163,97,0.07)", border:"1px solid rgba(23,163,97,0.15)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:9, color:T.green, letterSpacing:2, fontWeight:700, marginBottom:8 }}>STRENGTHS</div>
                  {(res.strengths||[]).map((s,i)=><div key={i} style={{ fontSize:11.5, color:T.muted, marginBottom:5, display:"flex", gap:7 }}><span style={{ color:T.green, flexShrink:0 }}>✓</span>{s}</div>)}
                </div>
                <div style={{ background:"rgba(192,41,58,0.07)", border:"1px solid rgba(192,41,58,0.15)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700, marginBottom:8 }}>RISKS</div>
                  {(res.risks||[]).map((r,i)=><div key={i} style={{ fontSize:11.5, color:T.muted, marginBottom:5, display:"flex", gap:7 }}><span style={{ color:T.amber, flexShrink:0 }}>!</span>{r}</div>)}
                </div>
              </div>
              {res.cinematic_references?.length>0 && (
                <GlassCard style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:8 }}>CINEMATIC DNA</div>
                  <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                    {res.cinematic_references.map(r=>(
                      <span key={r} style={{ fontSize:11, color:T.muted, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:6, padding:"3px 10px" }}>🎬 {r}</span>
                    ))}
                  </div>
                </GlassCard>
              )}
              <div style={{ background:"rgba(98,65,181,0.07)", border:"1px solid rgba(98,65,181,0.2)", borderRadius:10, padding:"14px 18px" }}>
                <div style={{ fontSize:9, color:T.violetL, letterSpacing:2, fontWeight:700, marginBottom:7 }}>DIRECTOR'S BRIEF</div>
                <div style={{ fontSize:13, color:T.muted, lineHeight:1.8 }}>{res.recommendation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHOT COMPOSER
// ═══════════════════════════════════════════════════════════════════════
const SHOTS_SYS = `You are LUMINARY Shot Composer — a master cinematographer and director with the combined expertise of Emmanuel Lubezki, Roger Deakins, and Christopher Nolan.
Given a scene description, generate a complete professional shot list and pre-viz breakdown.
Return ONLY valid JSON:
{
  "scene_title": "string",
  "scene_mood": "e.g. Tense / Melancholic / Euphoric",
  "suggested_lens": "e.g. 35mm Spherical",
  "color_grade": "e.g. Desaturated teal with warm highlights",
  "shots": [
    {
      "shot_number": 1,
      "shot_type": "e.g. Extreme Wide / Medium Close-Up / ECU",
      "angle": "e.g. Low angle / Eye level / Bird's eye",
      "movement": "e.g. Static / Slow push in / Handheld / Tracking left",
      "lens": "e.g. 24mm wide",
      "description": "What this shot shows and why it works narratively",
      "lighting": "Key light setup for this shot",
      "duration_seconds": 0-30,
      "emotion": "What emotion this shot targets"
    }
  ],
  "lighting_plan": "Overall scene lighting philosophy",
  "sound_design_notes": "Key sound elements to design",
  "director_note": "Overall directorial intent for the scene"
}
Generate 6-8 shots total.`;

function ShotCard({ shot, i }) {
  const colors = [T.gold,T.crimsonL,T.violetL,T.skyL,T.tealL,T.amber,T.green,T.muted];
  const c = colors[i%colors.length];
  return (
    <div style={{ background:T.glass, border:`1px solid ${T.border}`, borderRadius:13,
      overflow:"hidden", transition:"all 0.2s", animation:`stagger1 0.4s ${i*0.08}s both` }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=c+"44"; e.currentTarget.style.background=`${c}08`; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.glass; }}>
      {/* Film frame header */}
      <div style={{ background:`linear-gradient(135deg,${c}18,${c}08)`, borderBottom:`1px solid ${T.border}`,
        padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:26, borderRadius:4, background:`${c}22`, border:`1px solid ${c}44`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:c,
            fontFamily:"'Cinzel Decorative',serif" }}>S{shot.shot_number}</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:c }}>{shot.shot_type}</div>
            <div style={{ fontSize:10, color:T.muted }}>{shot.angle}</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:T.muted }}>{shot.duration_seconds}s</div>
          <div style={{ fontSize:10, color:T.dim }}>{shot.lens}</div>
        </div>
      </div>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ fontSize:12, color:T.muted, lineHeight:1.7, marginBottom:8 }}>{shot.description}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[
            { l:"Movement", v:shot.movement, c:T.gold },
            { l:"Emotion", v:shot.emotion, c:T.violetL },
          ].map(t=>(
            <span key={t.l} style={{ fontSize:10, color:t.c, background:`${t.c}10`, border:`1px solid ${t.c}25`, borderRadius:5, padding:"2px 8px" }}>
              {t.l}: {t.v}
            </span>
          ))}
        </div>
        <div style={{ marginTop:8, fontSize:11, color:T.dim, fontStyle:"italic", lineHeight:1.5 }}>
          💡 {shot.lighting}
        </div>
      </div>
    </div>
  );
}

function ShotComposer() {
  const [desc, setDesc] = useState(""); const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null); const [err, setErr] = useState("");

  const generate = async () => {
    setLoading(true); setRes(null); setErr("");
    const raw = await callClaude(SHOTS_SYS, desc);
    try { setRes(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setErr("Parse error: "+raw.slice(0,200)); }
    setLoading(false);
  };

  const sceneSamples = [
    "Two estranged brothers reunite at their mother's funeral. They haven't spoken in 10 years. They sit side by side at the empty house after everyone leaves.",
    "A heist crew's inside man realizes mid-job that he's been double-crossed. He's alone in the vault. Security cameras watch.",
    "The first human on an alien planet steps out of the airlock and sees a vast crystalline ocean under two moons."
  ];

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.skyL} number="03" title="Shot Composer"
        sub="Describe any scene and LUMINARY generates a complete professional shot list — camera angles, lens choices, movement choreography, lighting setup, duration, and directorial intent. Pre-visualize your film before production."/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:22, alignItems:"start" }}>
        <div>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)}
            placeholder={"Describe your scene...\n\nWho, what, where, what emotion, what narrative moment?"}
            style={{ width:"100%", height:220, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:12, color:T.text, fontSize:13, padding:"14px", lineHeight:1.8,
              fontFamily:"'Outfit',sans-serif", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=T.skyL+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={generate} disabled={loading||!desc.trim()}
            style={{ marginTop:12, width:"100%",
              background:desc.trim()&&!loading?`linear-gradient(135deg,${T.sky},#1a4a8a)`:"rgba(255,255,255,0.04)",
              color:desc.trim()&&!loading?"#fff":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?"⚙️  Composing shots...":"🎥  Generate Shot List"}
          </button>
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>SAMPLE SCENES</div>
            {sceneSamples.map((s,i)=>(
              <button key={i} onClick={()=>setDesc(s)} style={{ display:"block", width:"100%", textAlign:"left", marginBottom:6,
                background:T.glass, border:`1px solid ${T.border}`, borderRadius:8,
                padding:"9px 12px", color:T.muted, fontSize:11, lineHeight:1.5, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.skyL+"44"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
                <span style={{ color:T.skyL, marginRight:7 }}>▶</span>{s.slice(0,72)}...
              </button>
            ))}
          </div>
        </div>
        <div>
          {!res&&!loading&&!err && (
            <GlassCard style={{ minHeight:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>🎥</div>
              <div style={{ fontSize:13, color:T.dim }}>Your shot list storyboard will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:400 }}><LoadingBox color={T.skyL} label="Composing shots with AI director..." steps={["Planning narrative structure","Selecting camera positions","Choosing lens configurations","Designing lighting setups","Choreographing camera movement"]}/></GlassCard>}
          {err && <div style={{ color:T.red, fontSize:12, padding:14, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{err}</div>}
          {res && (
            <div>
              {/* Scene header */}
              <div style={{ background:T.glass, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16,
                display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>{res.scene_title}</div>
                  <div style={{ display:"flex", gap:10, marginTop:8 }}>
                    {[{l:"Mood",v:res.scene_mood,c:T.violetL},{l:"Lens",v:res.suggested_lens,c:T.gold}].map(x=>(
                      <span key={x.l} style={{ fontSize:10.5, color:x.c, background:`${x.c}0f`, border:`1px solid ${x.c}33`, borderRadius:6, padding:"3px 10px" }}>{x.l}: {x.v}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:8, lineHeight:1.6 }}>🎨 Grade: {res.color_grade}</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:T.skyL, fontFamily:"'Cinzel Decorative',serif" }}>{res.shots?.length}</div>
                  <div style={{ fontSize:9, color:T.muted }}>SHOTS</div>
                </div>
              </div>
              {/* Shot list */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                {(res.shots||[]).map((shot,i)=><ShotCard key={i} shot={shot} i={i}/>)}
              </div>
              {/* Director's note */}
              {res.director_note && (
                <div style={{ background:"rgba(98,65,181,0.07)", border:"1px solid rgba(98,65,181,0.2)", borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontSize:9, color:T.violetL, letterSpacing:2, fontWeight:700, marginBottom:7 }}>DIRECTOR'S INTENT</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.8 }}>{res.director_note}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VEO PROMPT STUDIO
// ═══════════════════════════════════════════════════════════════════════
const VEO_SYS = `You are LUMINARY VeoPrompt Engineer — the world's leading expert in generative video AI prompt engineering for Veo3, Runway Gen-3 Alpha, Pika Labs, and Sora.

Transform scene descriptions into precision-engineered generation prompts. Return ONLY valid JSON:
{
  "scene_title": "string",
  "veo3_prompt": "A 200-300 word ultra-detailed Veo3 prompt with cinematic language",
  "runway_prompt": "A concise 80-100 word Runway Gen-3 prompt",
  "pika_prompt": "A compact 60-80 word Pika Labs prompt",
  "negative_prompt": "What to avoid in generation",
  "technical_specs": {
    "aspect_ratio": "16:9 / 2.39:1 / 9:16",
    "duration_seconds": 5-30,
    "fps": 24,
    "resolution": "1080p / 4K",
    "camera_motion": "e.g. Slow dolly push, static wide, handheld follow",
    "lighting_style": "e.g. Golden hour backlight, neon practical, tungsten interior",
    "color_grade": "e.g. Desaturated teal shadows, warm highlights",
    "film_grain": "subtle / moderate / heavy",
    "depth_of_field": "shallow / deep"
  },
  "style_references": ["e.g. Blade Runner 2049", "e.g. Wong Kar-Wai — In the Mood for Love"],
  "mood_keywords": ["moody","cinematic","atmospheric","isolated"],
  "prompt_tips": ["tip 1","tip 2","tip 3"],
  "generation_warnings": ["warning about potential generation issue"]
}`;

function VeoPromptStudio() {
  const [desc, setDesc] = useState(""); const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null); const [copied, setCopied] = useState("");
  const [activePrompt, setActivePrompt] = useState("veo3");

  const generate = async () => {
    setLoading(true); setRes(null);
    const raw = await callClaude(VEO_SYS, desc);
    try { setRes(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch {}
    setLoading(false);
  };

  const copy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(()=>setCopied(""), 2000);
  };

  const samples = [
    "A geisha walks alone through a neon-lit Tokyo alley in heavy rain. Paper lanterns sway. She stops, looks up. One tear, then the alley floods with light.",
    "A 1970s muscle car races through a salt flat at sunset. Camera tracks low at ground level. Dust trails behind like wings. The driver is silhouetted.",
    "Deep ocean trench. A submersible's light illuminates an ancient temple. Bioluminescent creatures drift past stone carvings."
  ];

  const platforms = [
    { id:"veo3", label:"Veo 3", logo:"G", color:T.tealL, key:"veo3_prompt" },
    { id:"runway", label:"Runway Gen-3", logo:"R", color:T.violetL, key:"runway_prompt" },
    { id:"pika", label:"Pika Labs", logo:"P", color:T.skyL, key:"pika_prompt" },
  ];

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.tealL} number="04" title="VeoPrompt Studio"
        sub="Engineer precision prompts for Veo3, Runway Gen-3, and Pika Labs. Describe your vision in plain language — LUMINARY generates structured, cinematic-language generation prompts with camera specs, lighting parameters, color grade direction, negative prompts, and platform-specific optimizations."/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:22, alignItems:"start" }}>
        <div>
          <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>SCENE VISION</div>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)}
            placeholder={"Describe what you want to generate...\n\nBe specific: character, setting, lighting, camera, mood, action, time of day."}
            style={{ width:"100%", height:220, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:12, color:T.text, fontSize:13, padding:"14px", lineHeight:1.8,
              fontFamily:"'Outfit',sans-serif", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=T.tealL+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={generate} disabled={loading||!desc.trim()}
            style={{ marginTop:12, width:"100%",
              background:desc.trim()&&!loading?`linear-gradient(135deg,${T.teal},#0a6860)`:"rgba(255,255,255,0.04)",
              color:desc.trim()&&!loading?"#fff":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?"⚙️  Engineering prompts...":"✨  Generate Video Prompts"}
          </button>
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>SAMPLE VISIONS</div>
            {samples.map((s,i)=>(
              <button key={i} onClick={()=>setDesc(s)} style={{ display:"block", width:"100%", textAlign:"left", marginBottom:6,
                background:T.glass, border:`1px solid ${T.border}`, borderRadius:8,
                padding:"9px 12px", color:T.muted, fontSize:11, lineHeight:1.5, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.tealL+"44"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
                <span style={{ color:T.tealL, marginRight:7 }}>▶</span>{s.slice(0,75)}...
              </button>
            ))}
          </div>
          {/* Platform explainer */}
          <div style={{ marginTop:18, background:T.glass, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px" }}>
            <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>SUPPORTED PLATFORMS</div>
            {platforms.map(p=>(
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:`${p.color}22`, border:`1px solid ${p.color}44`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:p.color }}>{p.logo}</div>
                <span style={{ fontSize:12, color:T.muted }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {!res&&!loading && (
            <GlassCard style={{ minHeight:440, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>✨</div>
              <div style={{ fontSize:13, color:T.dim, textAlign:"center", lineHeight:1.7 }}>
                Your platform-optimized generation prompts<br/>will appear here
              </div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:440 }}><LoadingBox color={T.tealL} label="Engineering generation prompts..." steps={["Parsing cinematic vision","Optimizing for Veo3 syntax","Adapting for Runway Gen-3","Compacting for Pika Labs","Adding technical parameters"]}/></GlassCard>}
          {res && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* Tech specs */}
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:12 }}>TECHNICAL PARAMETERS</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {Object.entries(res.technical_specs||{}).map(([k,v])=>(
                    <div key={k} style={{ background:"rgba(255,255,255,0.02)", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontSize:9, color:T.dim, letterSpacing:1, marginBottom:3 }}>{k.replace(/_/g," ").toUpperCase()}</div>
                      <div style={{ fontSize:12, color:T.tealL, fontWeight:600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Platform tabs */}
              <div style={{ display:"flex", gap:8 }}>
                {platforms.map(p=>(
                  <button key={p.id} onClick={()=>setActivePrompt(p.id)}
                    style={{ flex:1, padding:"9px 12px", borderRadius:9,
                      background:activePrompt===p.id?`${p.color}18`:T.glass,
                      border:`1px solid ${activePrompt===p.id?p.color+"55":T.border}`,
                      color:activePrompt===p.id?p.color:T.muted, fontSize:12, fontWeight:600, transition:"all 0.15s" }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Active prompt */}
              {platforms.map(p => p.id === activePrompt && res[p.key] && (
                <div key={p.id} style={{ background:T.glass, border:`1px solid ${p.color}33`, borderRadius:14, padding:"16px 18px", position:"relative" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontSize:9, color:p.color, letterSpacing:2, fontWeight:700 }}>{p.label.toUpperCase()} PROMPT</div>
                    <button onClick={()=>copy(res[p.key], p.id)}
                      style={{ fontSize:11, color:copied===p.id?T.green:p.color, background:`${p.color}10`,
                        border:`1px solid ${p.color}33`, borderRadius:7, padding:"5px 12px", fontWeight:600 }}>
                      {copied===p.id?"✓ Copied!":"📋 Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize:12.5, color:T.muted, lineHeight:1.85, whiteSpace:"pre-wrap",
                    fontFamily:"'JetBrains Mono',monospace", background:"rgba(255,255,255,0.02)",
                    borderRadius:10, padding:"12px", border:`1px solid ${T.border}` }}>
                    {res[p.key]}
                  </div>
                </div>
              ))}

              {/* Negative prompt */}
              {res.negative_prompt && (
                <div style={{ background:"rgba(192,41,58,0.06)", border:"1px solid rgba(192,41,58,0.18)", borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700 }}>⊘ NEGATIVE PROMPT</div>
                    <button onClick={()=>copy(res.negative_prompt,"neg")}
                      style={{ fontSize:10, color:copied==="neg"?T.green:T.crimsonL, background:"rgba(192,41,58,0.08)",
                        border:"1px solid rgba(192,41,58,0.2)", borderRadius:6, padding:"3px 10px" }}>
                      {copied==="neg"?"✓ Copied":"Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize:12, color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>{res.negative_prompt}</div>
                </div>
              )}

              {/* Mood keywords */}
              {res.mood_keywords?.length>0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {res.mood_keywords.map(k=>(
                    <span key={k} style={{ fontSize:10.5, color:T.teal, background:T.tealGlow,
                      border:`1px solid ${T.teal}33`, borderRadius:20, padding:"3px 10px" }}>{k}</span>
                  ))}
                </div>
              )}

              {/* Prompt tips */}
              {res.prompt_tips?.length>0 && (
                <GlassCard style={{ padding:"14px 16px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:9 }}>💡 PROMPT ENGINEERING TIPS</div>
                  {res.prompt_tips.map((t,i)=>(
                    <div key={i} style={{ fontSize:12, color:T.muted, marginBottom:5, display:"flex", gap:8 }}>
                      <span style={{ color:T.tealL, flexShrink:0 }}>→</span>{t}
                    </div>
                  ))}
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EMOTI CINE
// ═══════════════════════════════════════════════════════════════════════
const EMO_DATA = [
  { scene:"Opening",    joy:58,tension:18,fear:8, sadness:14,surprise:42 },
  { scene:"Inciting",   joy:72,tension:28,fear:12,sadness:18,surprise:55 },
  { scene:"Rising",     joy:44,tension:56,fear:32,sadness:34,surprise:38 },
  { scene:"Midpoint",   joy:36,tension:68,fear:44,sadness:50,surprise:30 },
  { scene:"Complication",joy:20,tension:82,fear:60,sadness:64,surprise:42 },
  { scene:"Dark Night", joy:10,tension:92,fear:82,sadness:88,surprise:18 },
  { scene:"Climax",     joy:28,tension:98,fear:76,sadness:72,surprise:85 },
  { scene:"Resolution", joy:88,tension:14,fear:6, sadness:32,surprise:62 },
  { scene:"Epilogue",   joy:92,tension:8, fear:4, sadness:22,surprise:40 },
];
const EMOS = [
  { k:"joy", c:"#c8941a", l:"Joy" },{ k:"tension", c:"#c0293a", l:"Tension" },
  { k:"fear", c:"#6241b5", l:"Fear" },{ k:"sadness", c:"#2876c9", l:"Sadness" },
  { k:"surprise", c:"#18a89a", l:"Surprise" },
];

function EmotiCine() {
  const [active, setActive] = useState("all"); const [hov, setHov] = useState(null);
  const CT = ({ active:a, payload:p, label:l }) => {
    if(!a||!p?.length) return null;
    return (
      <div style={{ background:"rgba(2,2,8,0.97)", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 16px", backdropFilter:"blur(12px)" }}>
        <div style={{ fontSize:12, color:T.gold, marginBottom:8, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>{l}</div>
        {p.map(x=><div key={x.dataKey} style={{ fontSize:12, color:x.color, marginBottom:3 }}>{x.name}: <strong>{x.value}%</strong></div>)}
      </div>
    );
  };
  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.violetL} number="05" title="EmotiCine Analytics"
        sub="Visualize the complete emotional architecture of your film. Map joy, tension, fear, sadness, and surprise across every structural beat — identify where audiences peak, where they disengage, and where catharsis lands."/>
      <div style={{ background:T.glass, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 20px", marginBottom:20,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>🎬 The Lighthouse Protocol</div>
          <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>Sci-Fi Thriller · 112 min · 9 Scenes · Sample Analysis</div>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {[{v:"98%",l:"Peak Tension",c:T.crimsonL},{v:"92%",l:"Joy Peak",c:T.gold},{v:"87",l:"LUMINARY Score",c:T.violetL}].map(s=>(
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:s.c, fontFamily:"'Cinzel Decorative',serif" }}>{s.v}</div>
              <div style={{ fontSize:9.5, color:T.dim }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:16, flexWrap:"wrap" }}>
        {[{k:"all",c:T.gold,l:"All Emotions"},...EMOS].map(e=>(
          <button key={e.k} onClick={()=>setActive(e.k)}
            style={{ background:active===e.k?`${e.c}18`:"transparent", border:`1px solid ${active===e.k?e.c+"55":T.border}`,
              color:active===e.k?e.c:T.muted, borderRadius:20, padding:"7px 15px", fontSize:12, fontWeight:600, transition:"all 0.15s" }}>{e.l}</button>
        ))}
      </div>
      <GlassCard style={{ padding:"22px 18px 14px", marginBottom:18 }}>
        <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:18 }}>CINEMATIC EMOTIONAL ARC — SCENE BY SCENE</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={EMO_DATA} margin={{ top:8,right:16,bottom:8,left:-12 }}>
            <defs>{EMOS.map(e=>(
              <linearGradient key={e.k} id={`eg_${e.k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={e.c} stopOpacity={0.3}/><stop offset="95%" stopColor={e.c} stopOpacity={0}/>
              </linearGradient>
            ))}</defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
            <XAxis dataKey="scene" tick={{ fill:T.muted, fontSize:10, fontFamily:"'Outfit'" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:T.dim, fontSize:9 }} axisLine={false} tickLine={false} domain={[0,100]}/>
            <Tooltip content={<CT/>}/>
            {EMOS.map(e=>(active==="all"||active===e.k)&&(
              <Area key={e.k} type="monotone" dataKey={e.k} name={e.l}
                stroke={e.c} strokeWidth={active===e.k?2.5:1.5} fill={`url(#eg_${e.k})`}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {EMO_DATA.map((sc,i)=>{
          const dom = EMOS.reduce((mx,e)=>sc[e.k]>(sc[mx?.k]||0)?e:mx,EMOS[0]);
          return (
            <div key={sc.scene}
              style={{ background:hov===i?`${dom.c}0e`:T.glass, border:`1px solid ${hov===i?dom.c+"44":T.border}`,
                borderRadius:10, padding:"13px 15px", transition:"all 0.17s" }}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <div style={{ fontSize:9.5, color:T.dim, fontFamily:"'Cinzel Decorative',serif" }}>SCENE {i+1}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text, margin:"4px 0 8px" }}>{sc.scene}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {EMOS.sort((a,b)=>sc[b.k]-sc[a.k]).slice(0,2).map(e=>(
                  <span key={e.k} style={{ fontSize:9.5, fontWeight:700, color:e.c, background:`${e.c}12`,
                    border:`1px solid ${e.c}30`, borderRadius:5, padding:"2px 7px" }}>{e.l} {sc[e.k]}%</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FESTIVAL ORACLE
// ═══════════════════════════════════════════════════════════════════════
const FESTIVAL_SYS = `You are LUMINARY Festival Oracle — the world's foremost AI expert on international film festival submission strategy with deep knowledge of 500+ festivals across every continent.

Analyze the given project and generate a strategic festival roadmap. Return ONLY valid JSON:
{
  "project_assessment": "2-3 sentence honest assessment of festival potential",
  "tier": "A-List / Prestige / Mid-Tier / Emerging",
  "strategy": "Overall submission strategy (2-3 sentences)",
  "festivals": [
    {
      "name": "Festival Name",
      "location": "City, Country",
      "tier": "A-List / Prestige / Specialty / Regional",
      "acceptance_probability": 0-100,
      "submission_window": "e.g. August–October",
      "why_this_festival": "Specific reason this film fits this festival",
      "category": "Competition / Sidebar / Market / Short",
      "strategy_tip": "Specific submission strategy tip"
    }
  ],
  "circuit_order": ["Festival 1 → Festival 2 → ..."],
  "marketing_angle": "The key marketing/positioning angle for festival submissions",
  "avoid": ["festivals to avoid and why"]
}
Include 8-10 diverse festivals from different continents.`;

function FestivalOracle() {
  const [form, setForm] = useState({ title:"", genre:"", runtime:"", country:"", synopsis:"", budget:"", language:"" });
  const [loading, setLoading] = useState(false); const [res, setRes] = useState(null);

  const generate = async () => {
    setLoading(true); setRes(null);
    const prompt = `Film project:\nTitle: ${form.title}\nGenre: ${form.genre}\nRuntime: ${form.runtime} min\nCountry: ${form.country}\nLanguage: ${form.language}\nBudget: ${form.budget}\nSynopsis: ${form.synopsis}`;
    const raw = await callClaude(FESTIVAL_SYS, prompt);
    try { setRes(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch {}
    setLoading(false);
  };

  const tierColors = { "A-List":T.gold, Prestige:T.goldL, Specialty:T.tealL, Regional:T.violetL };

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.amber} number="06" title="Festival Oracle"
        sub="AI-powered international film festival strategy. Describe your project and LUMINARY maps your optimal submission circuit — with acceptance probability scores, tier classification, submission windows, and insider positioning tips for each festival."/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:22, alignItems:"start" }}>
        <div>
          <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:12 }}>PROJECT DETAILS</div>
          {[
            { k:"title", l:"Film Title", ph:"e.g. The Glass Sea" },
            { k:"genre", l:"Genre", ph:"e.g. Drama / Thriller / Documentary" },
            { k:"runtime", l:"Runtime (mins)", ph:"e.g. 92" },
            { k:"country", l:"Country of Production", ph:"e.g. India" },
            { k:"language", l:"Language", ph:"e.g. Tamil / English" },
            { k:"budget", l:"Budget Tier", ph:"e.g. $200K indie, $2M mid-budget" },
          ].map(f=>(
            <div key={f.k} style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:500 }}>{f.l}</div>
              <input value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                placeholder={f.ph} style={{ width:"100%", background:T.glass, border:`1px solid ${T.border}`,
                  borderRadius:9, color:T.text, fontSize:13, padding:"10px 12px", transition:"border 0.2s" }}
                onFocus={e=>e.target.style.borderColor=T.amber+"55"}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          ))}
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:500 }}>Synopsis (brief)</div>
            <textarea value={form.synopsis} onChange={e=>setForm(p=>({...p,synopsis:e.target.value}))}
              placeholder="What is your film about? Core themes, story, tone..."
              style={{ width:"100%", height:100, background:T.glass, border:`1px solid ${T.border}`,
                borderRadius:9, color:T.text, fontSize:13, padding:"10px 12px", lineHeight:1.7, transition:"border 0.2s",
                fontFamily:"'Outfit',sans-serif" }}
              onFocus={e=>e.target.style.borderColor=T.amber+"55"}
              onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <button onClick={generate} disabled={loading||!form.synopsis.trim()}
            style={{ width:"100%", background:form.synopsis.trim()&&!loading?`linear-gradient(135deg,${T.amber},#7a4a08)`:"rgba(255,255,255,0.04)",
              color:form.synopsis.trim()&&!loading?"#fff":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?"⚙️  Mapping festival circuit...":"🏆  Generate Festival Strategy"}
          </button>
          <button onClick={()=>setForm({ title:"The Glass Sea", genre:"Drama", runtime:"94", country:"India", language:"Tamil with English subtitles", budget:"$400K micro-budget", synopsis:"A deaf fisherman on the Tamil Nadu coast discovers an encrypted distress signal that leads him to a sunken research vessel. As he investigates, he uncovers a corporate conspiracy that threatens the coastal community — but his disability means no one believes him." })}
            style={{ marginTop:8, width:"100%", background:T.glass, border:`1px solid ${T.border}`,
              color:T.muted, borderRadius:10, padding:"10px", fontSize:12 }}>
            Load Sample Project
          </button>
        </div>

        <div>
          {!res&&!loading && (
            <GlassCard style={{ minHeight:480, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>🏆</div>
              <div style={{ fontSize:13, color:T.dim, textAlign:"center" }}>Your festival circuit strategy will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:480 }}><LoadingBox color={T.amber} label="Mapping your festival circuit..." steps={["Analyzing project profile","Searching 500+ global festivals","Calculating acceptance probabilities","Building circuit strategy","Generating submission tips"]}/></GlassCard>}
          {res && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700 }}>PROJECT ASSESSMENT</div>
                  <span style={{ fontSize:11, fontWeight:700, color:tierColors[res.tier]||T.gold,
                    background:`${tierColors[res.tier]||T.gold}12`, border:`1px solid ${tierColors[res.tier]||T.gold}33`,
                    borderRadius:6, padding:"3px 10px" }}>{res.tier}</span>
                </div>
                <div style={{ fontSize:13, color:T.muted, lineHeight:1.75, marginBottom:10 }}>{res.project_assessment}</div>
                <div style={{ fontSize:12, color:T.amber, fontStyle:"italic" }}>Strategy: {res.strategy}</div>
              </GlassCard>

              {(res.festivals||[]).map((f,i)=>(
                <div key={i} style={{ background:T.glass, border:`1px solid ${T.border}`, borderRadius:12,
                  padding:"14px 16px", transition:"all 0.18s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.amber+"44"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.text }}>{f.name}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{f.location} · {f.submission_window}</div>
                    </div>
                    <div style={{ textAlign:"center", flexShrink:0 }}>
                      <div style={{ fontSize:22, fontWeight:900, color:f.acceptance_probability>=60?T.green:f.acceptance_probability>=35?T.amber:T.red, fontFamily:"'Cinzel Decorative',serif" }}>{f.acceptance_probability}%</div>
                      <div style={{ fontSize:9, color:T.dim }}>ACCEPTANCE</div>
                    </div>
                  </div>
                  <div style={{ height:3, background:"rgba(255,255,255,0.04)", borderRadius:2, marginBottom:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${f.acceptance_probability}%`,
                      background:`linear-gradient(90deg,${f.acceptance_probability>=60?T.green:f.acceptance_probability>=35?T.amber:T.red}66,${f.acceptance_probability>=60?T.green:f.acceptance_probability>=35?T.amber:T.red})`,
                      borderRadius:2, transition:"width 1s ease" }}/>
                  </div>
                  <div style={{ fontSize:12, color:T.muted, lineHeight:1.65, marginBottom:7 }}>{f.why_this_festival}</div>
                  <div style={{ fontSize:11, color:T.amber, fontStyle:"italic" }}>💡 {f.strategy_tip}</div>
                </div>
              ))}

              {res.marketing_angle && (
                <GlassCard style={{ padding:"14px 16px", background:"rgba(200,148,26,0.06)" }}>
                  <div style={{ fontSize:9, color:T.gold, letterSpacing:2, fontWeight:700, marginBottom:7 }}>MARKETING ANGLE</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.75 }}>{res.marketing_angle}</div>
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CINEACCESS
// ═══════════════════════════════════════════════════════════════════════
const ACCESS_MODES = [
  { id:"audio", icon:"🔊", label:"Audio Description", sub:"Blind & low-vision", color:T.teal,
    sys:`You are CineAccess Audio Description Engine. Given a scene, write professional broadcast-quality audio description for visually impaired viewers. Be spatial, precise, cinematic. Include appearance, action, setting, on-screen text, and atmosphere.` },
  { id:"cog", icon:"🧩", label:"Cognitive Mode", sub:"Neurodivergent viewers", color:T.gold,
    sys:`You are CineAccess Cognitive Engine. Rewrite scene descriptions for neurodivergent viewers. Use max 12-word sentences, plain vocabulary, explicit scene labels [SCENE CHANGE], [LOUD SOUND], [KEY MOMENT], no metaphors, warm and clear.` },
  { id:"cultural", icon:"🌍", label:"Cultural Notes", sub:"Global adaptation", color:T.violetL,
    sys:`You are CineAccess Cultural Intelligence Engine. For the given scene provide: (1) cultural references to explain globally, (2) idioms that don't translate, (3) sensitivity flags for 3 specific regions, (4) adaptive versions for different markets. Be nuanced and specific.` },
  { id:"lang", icon:"🈳", label:"Sign Language Notes", sub:"Deaf communities", color:T.skyL,
    sys:`You are CineAccess Deaf/HoH Adaptation Specialist. For the given scene, provide: (1) what dialogue or sound must be conveyed through intertitles, (2) how to adapt visual storytelling for deaf audiences, (3) sign language stage directions for a live performance adaptation, (4) key non-verbal cues to emphasize.` },
];

function CineAccess() {
  const [mode, setMode] = useState("audio"); const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); const [output, setOutput] = useState("");
  const cm = ACCESS_MODES.find(m=>m.id===mode);
  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader color={T.teal} number="07" title="CineAccess Studio"
        sub="Break every barrier cinema has ever built. AI generates professional-grade audio descriptions, cognitive adaptations, cultural localization notes, and deaf community adaptations — opening your film to 2.2 billion people globally."/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:22 }}>
        {ACCESS_MODES.map(m=>(
          <button key={m.id} onClick={()=>{ setMode(m.id); setOutput(""); }}
            style={{ textAlign:"left", background:mode===m.id?`${m.color}12`:T.glass,
              border:`1px solid ${mode===m.id?m.color+"44":T.border}`, borderRadius:12, padding:"14px" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
            <div style={{ fontSize:12, fontWeight:700, color:mode===m.id?m.color:T.text, marginBottom:3 }}>{m.label}</div>
            <div style={{ fontSize:10, color:T.dim }}>{m.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            placeholder="Describe a film scene in detail..."
            style={{ width:"100%", height:240, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:12, color:T.text, fontSize:13, padding:"14px", lineHeight:1.8,
              fontFamily:"'Outfit',sans-serif", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=cm.color+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={async()=>{ setLoading(true);setOutput(""); const r=await callClaude(cm.sys,input); setOutput(r); setLoading(false); }}
            disabled={loading||!input.trim()}
            style={{ marginTop:12, width:"100%",
              background:input.trim()&&!loading?`linear-gradient(135deg,${cm.color},${cm.color}88)`:"rgba(255,255,255,0.04)",
              color:input.trim()&&!loading?"#000":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?`⚙️  Generating ${cm.label}...`:`♿  Generate ${cm.label}`}
          </button>
        </div>
        <div style={{ background:T.glass, border:`1px solid ${loading?cm.color+"44":T.border}`, borderRadius:12, padding:"16px", minHeight:280, transition:"border 0.3s", overflowY:"auto" }}>
          {loading && <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:14 }}><Spinner color={cm.color}/><div style={{ fontSize:12, color:T.muted }}>Generating...</div></div>}
          {!loading&&!output && <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:10 }}><div style={{ fontSize:38, opacity:0.1 }}>{cm.icon}</div><div style={{ fontSize:12, color:T.dim }}>Output appears here</div></div>}
          {output && <div style={{ fontSize:13, color:T.muted, lineHeight:1.9, whiteSpace:"pre-wrap" }}>{output}</div>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CINECHAT
// ═══════════════════════════════════════════════════════════════════════
const CHAT_SYS = `You are CineChat — LUMINARY's elite AI cinema intelligence. You combine the expertise of a master cinematographer, Hollywood script doctor, film theorist, distribution strategist, and Indian cinema scholar.

Core expertise: cinematography, screenwriting, film theory (auteur, semiotics, montage), production planning, festival circuit, OTT vs theatrical strategy, Indian cinema (Bollywood, Tamil, Telugu, Malayalam), AI in filmmaking (Veo3, Runway, Pika, Sora), film history.

Be inspiring, precise, and actionable. Keep responses focused (3-6 sentences) unless complexity demands more. Use specific film references. Always offer practical next steps.`;

const QUICK_Q = [
  "How do I write a perfect opening scene?","What makes scripts commercially viable?",
  "Explain the hero's journey vs Save the Cat","How is Veo3 changing indie filmmaking?",
  "Best OTT vs festival strategy for indie films?","What is the golden ratio in cinematography?",
  "How do I write subtext-heavy dialogue?","Tamil cinema's global breakthrough formula?"
];

function CineChat() {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"Welcome to CineChat — LUMINARY's cinema intelligence.\n\nI have deep knowledge across cinematography, screenwriting, film theory, distribution strategy, Indian cinema, generative video AI, and the global film business.\n\nWhat would you like to explore? 🎬" }]);
  const [inp, setInp] = useState(""); const [loading, setLoading] = useState(false);
  const ref = useRef();
  useEffect(()=>{ ref.current?.scrollIntoView({ behavior:"smooth" }); },[msgs,loading]);
  const send = async text => {
    const m = text||inp; if(!m.trim()||loading) return;
    const nm = [...msgs, { role:"user", content:m }];
    setMsgs(nm); setInp(""); setLoading(true);
    const r = await callClaudeChat(CHAT_SYS, nm.map(x=>({role:x.role,content:x.content})));
    setMsgs([...nm, { role:"assistant", content:r }]);
    setLoading(false);
  };
  return (
    <div style={{ padding:"40px 40px 0", animation:"fadeUp 0.4s ease forwards", display:"flex", flexDirection:"column", height:"calc(100vh - 40px)" }}>
      <ModuleHeader color={T.skyL} number="08" title="CineChat AI" sub="Your always-on cinema intelligence — script structure, cinematography theory, distribution strategy, Indian cinema expertise, and generative AI filmmaking."/>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:16, flexShrink:0 }}>
        {QUICK_Q.map(q=>(
          <button key={q} onClick={()=>send(q)} style={{ background:T.glass, border:`1px solid ${T.border}`,
            borderRadius:20, padding:"6px 13px", fontSize:11, color:T.muted, transition:"all 0.15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.skyL+"55"; e.currentTarget.style.color=T.text; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>{q}</button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", background:T.glass, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px", marginBottom:14, minHeight:0 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:14 }}>
            {m.role==="assistant" && (
              <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,marginRight:9,marginTop:2,
                background:`linear-gradient(135deg,${T.gold},${T.violet})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>✦</div>
            )}
            <div style={{ maxWidth:"72%", background:m.role==="user"?"linear-gradient(135deg,rgba(40,118,201,0.18),rgba(98,65,181,0.12))":"rgba(255,255,255,0.03)",
              border:`1px solid ${m.role==="user"?"rgba(40,118,201,0.25)":T.border}`,
              borderRadius:m.role==="user"?"14px 3px 14px 14px":"3px 14px 14px 14px", padding:"12px 15px" }}>
              {m.role==="assistant" && <div style={{ fontSize:8.5,color:T.gold,fontWeight:700,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel Decorative',serif" }}>CINECHAT</div>}
              <div style={{ fontSize:13, color:T.text, lineHeight:1.85, whiteSpace:"pre-wrap" }}>{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${T.gold},${T.violet})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>✦</div>
            <div style={{ display:"flex", gap:5, padding:"12px 14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, borderRadius:"3px 14px 14px 14px" }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:T.gold,animation:`dot 1.2s ${i*0.18}s ease-in-out infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={ref}/>
      </div>
      <div style={{ display:"flex", gap:10, paddingBottom:22, flexShrink:0 }}>
        <input value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder="Ask anything about cinema, filmmaking, theory, strategy..."
          style={{ flex:1, background:T.glass, border:`1px solid ${T.border}`, borderRadius:11,
            color:T.text, fontSize:13, padding:"13px 16px", transition:"border 0.2s" }}
          onFocus={e=>e.target.style.borderColor=T.skyL+"55"}
          onBlur={e=>e.target.style.borderColor=T.border}/>
        <button onClick={()=>send()} disabled={loading||!inp.trim()}
          style={{ background:inp.trim()&&!loading?`linear-gradient(135deg,${T.sky},${T.violet})`:"rgba(255,255,255,0.04)",
            border:"none", color:inp.trim()&&!loading?"#fff":T.dim, borderRadius:11, padding:"13px 20px", fontSize:16, fontWeight:700, transition:"all 0.2s" }}>→</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html:css }}/>
      <div style={{ display:"flex", minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Outfit',sans-serif" }}>
        <Background/>
        <Sidebar tab={tab} setTab={setTab}/>
        <main style={{ marginLeft:230, flex:1, position:"relative", zIndex:1, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column" }}>
          <FilmTicker/>
          {tab==="home"    && <HomePage setTab={setTab}/>}
          {tab==="scene"   && <SceneAutopsy/>}
          {tab==="script"  && <ScriptAlchemist/>}
          {tab==="emotion" && <EmotiCine/>}
          {tab==="shots"   && <ShotComposer/>}
          {tab==="veo"     && <VeoPromptStudio/>}
          {tab==="festival"&& <FestivalOracle/>}
          {tab==="access"  && <CineAccess/>}
          {tab==="chat"    && <CineChat/>}
        </main>
      </div>
    </>
  );
}
