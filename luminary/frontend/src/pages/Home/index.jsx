import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';

export default function Home() {
  const navigate = useNavigate();

  const modules = [
    { id:"scene", path:"/scene", icon:"🎬", color:'var(--crimson-l)', glow:'var(--crimson-glow)', title:"Scene Autopsy",
      desc:"Upload any movie still or scene screenshot. Claude Vision dissects cinematography, lighting, composition, narrative power, and emotional impact — returning a full professional film critic analysis with animated scores." },
    { id:"script", path:"/script", icon:"⚗️", color:'var(--gold)', glow:'var(--gold-glow)', title:"Script Alchemist",
      desc:"AI-powered screenplay intelligence. Paste any script or synopsis for genre classification, emotional arc mapping, budget estimation, production risk analysis, and a full director's brief." },
    { id:"shots", path:"/shots", icon:"🎥", color:'var(--sky-l)', glow:'var(--sky-glow)', title:"Shot Composer",
      desc:"Describe a scene in plain language. AI generates a complete professional shot list with camera angles, lens choices, movements, lighting setups, and color grade direction — visualized as a storyboard." },
    { id:"veo", path:"/veo", icon:"✨", color:'var(--teal-l)', glow:'var(--teal-glow)', title:"VeoPrompt Studio",
      desc:"Engineer precision prompts for Veo3, Runway Gen-3, and Pika Labs. AI transforms your vision into structured generation prompts with camera specs, motion language, and cinematic style parameters." },
    { id:"emotion", path:"/emotion", icon:"🧠", color:'var(--violet-l)', glow:'var(--violet-glow)', title:"EmotiCine Analytics",
      desc:"Map emotional intensity across every scene — joy, tension, fear, sadness, surprise — as cinematic waveforms. Identify audience resonance peaks and structural arc patterns before a frame is shot." },
    { id:"festival", path:"/festival", icon:"🏆", color:'var(--amber)', glow:'var(--gold-glow)', title:"Festival Oracle",
      desc:"AI-powered festival submission strategy. Input your film's details and get matched to optimal festivals with acceptance probability scores, submission tips, and global circuit roadmaps." },
    { id:"access", path:"/access", icon:"♿", color:'var(--teal)', glow:'var(--teal-glow)', title:"CineAccess",
      desc:"Break every barrier. AI generates professional audio descriptions, cognitive-friendly scripts, and cultural adaptation notes — making your film accessible to 2.2 billion people globally." },
    { id:"chat", path:"/chat", icon:"💬", color:'var(--sky-l)', glow:'var(--sky-glow)', title:"CineChat AI",
      desc:"Your always-on cinema intelligence. Script structure, cinematography theory, distribution strategy, Indian cinema, AI in filmmaking — real multi-turn conversation with a master film expert." },
  ];
  const stats = [
    { v:"9", l:"AI Modules", c:'var(--gold)' },
    { v:"Real", l:"Claude Vision API", c:'var(--crimson-l)' },
    { v:"2.2B", l:"Accessibility Impact", c:'var(--teal)' },
    { v:"Veo3", l:"Gen-Video Ready", c:'var(--teal-l)' },
    { v:"100%", l:"Live AI Outputs", c:'var(--violet-l)' },
    { v:"0", l:"Fake/Hardcoded AI", c:'var(--muted)' },
  ];

  return (
    <div style={{ animation:"fadeUp 0.5s ease forwards" }}>
      {/* Hero */}
      <div style={{ textAlign:"center", padding:"48px 48px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", left:0, right:0, height:2,
            background:`linear-gradient(90deg,transparent,var(--gold-glow),var(--violet-glow),transparent)`,
            animation:"scan 10s linear infinite" }}/>
        </div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8,
          background:"linear-gradient(135deg,rgba(200,148,26,0.1),rgba(98,65,181,0.07))",
          border:"1px solid rgba(200,148,26,0.22)", borderRadius:20, padding:"6px 18px", marginBottom:24 }}>
          <span style={{ fontSize:9, color:'var(--gold)', letterSpacing:4, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>
            ✦ OPEN INNOVATION · TRACK 5 · CODEFLIX 2026
          </span>
        </div>
        <h1 style={{ fontSize:52, fontWeight:900, lineHeight:1.05, fontFamily:"'Cinzel Decorative',serif",
          background:`linear-gradient(135deg, var(--text) 0%, var(--gold-l) 40%, var(--violet-l) 80%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          marginBottom:18, letterSpacing:0.5 }}>
          The World's First<br/>Neuro-Cinematic<br/>Intelligence Platform
        </h1>
        <p style={{ fontSize:15, color:'var(--muted)', maxWidth:580, margin:"0 auto 34px", lineHeight:1.8 }}>
          <strong style={{ color:'var(--text)' }}>LUMINARY v2.0</strong> — Nine AI-powered modules unifying scene vision analysis,
          script intelligence, generative pre-viz, emotion analytics, universal accessibility,
          and festival strategy. Real APIs. Real outputs. Real innovation.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {[{l:"🎬 Scene Autopsy",path:"/scene",p:true},{l:"⚗️ Script Analysis",path:"/script",p:false},{l:"✨ VeoPrompt",path:"/veo",p:false},{l:"🏆 Festival Oracle",path:"/festival",p:false}].map(b=>(
            <button key={b.path} onClick={()=>navigate(b.path)}
              style={{ background:b.p?`linear-gradient(135deg,var(--gold),#a07010)`:"rgba(255,255,255,0.04)",
                color:b.p?"#000":'var(--muted)', border:b.p?"none":`1px solid var(--border)`,
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
            <div style={{ fontSize:10, color:'var(--muted)', marginTop:4 }}>{s.l}</div>
          </GlassCard>
        ))}
      </div>
      {/* Module grid */}
      <div style={{ padding:"0 40px 48px" }}>
        <div style={{ fontSize:9, color:'var(--dim)', letterSpacing:3, fontWeight:700, marginBottom:16 }}>PLATFORM MODULES — CLICK TO EXPLORE</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {modules.map(m=>(
            <GlassCard key={m.id} accent={m.color} onClick={()=>navigate(m.path)} style={{ padding:"24px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-50, right:-50, width:140, height:140, borderRadius:"50%",
                background:`radial-gradient(circle,${m.glow} 0%,transparent 70%)`, pointerEvents:"none" }}/>
              <div style={{ fontSize:28, marginBottom:12 }}>{m.icon}</div>
              <div style={{ fontSize:13.5, fontWeight:700, color:m.color, marginBottom:7, fontFamily:"'Outfit',sans-serif" }}>{m.title}</div>
              <div style={{ fontSize:12.5, color:'var(--muted)', lineHeight:1.75 }}>{m.desc}</div>
              <div style={{ marginTop:14, fontSize:11, color:m.color, fontWeight:600 }}>Launch module →</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
