import React, { useState } from 'react';
import { useVeoPrompt } from '../../hooks/useVeoPrompt';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import LoadingBox from '../../components/ui/LoadingBox';
import { FilmStrip } from '../../components/ui/CineImage';
import { T } from '../../constants/theme';

export default function VeoPromptStudio() {
  const { desc, setDesc, loading, statusText, result, error, copied, generate, copyPrompt, generateVideo, generatingVideo, videoResult } = useVeoPrompt();
  const [activePrompt, setActivePrompt] = useState("veo3");

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

  // Build preview frames from the Veo3 prompt
  const previewFrames = result?.veo3_prompt ? [
    { prompt: `cinematic film still, ${result.veo3_prompt.slice(0, 200)}, opening shot, dramatic lighting`, label: "OPENING FRAME", seed: 10 },
    { prompt: `cinematic film still, ${result.veo3_prompt.slice(0, 200)}, mid action, dynamic composition`, label: "MID ACTION", seed: 25 },
    { prompt: `cinematic film still, ${result.veo3_prompt.slice(0, 200)}, climax moment, intense mood`, label: "CLIMAX FRAME", seed: 55 },
  ] : [];

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
          {error && <div style={{ color:T.red, fontSize:12, padding:14, marginTop:10, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
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
          {!result&&!loading&&!error && (
            <GlassCard style={{ minHeight:440, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>✨</div>
              <div style={{ fontSize:13, color:T.dim, textAlign:"center", lineHeight:1.7 }}>
                Your platform-optimized generation prompts<br/>will appear here
              </div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:440 }}><LoadingBox color={T.tealL} label={statusText || "Engineering generation prompts..."} steps={["Parsing cinematic vision","Optimizing for Veo3 syntax","Adapting for Runway Gen-3","Compacting for Pika Labs","Adding technical parameters"]}/></GlassCard>}
          {result && !loading && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* AI PREVIEW FRAMES */}
              {previewFrames.length > 0 && (
                <GlassCard style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:9, color:T.tealL, letterSpacing:2, fontWeight:700, marginBottom:12 }}>🎬 AI PREVIEW FRAMES</div>
                  <div style={{ fontSize:11, color:T.dim, marginBottom:10 }}>Click any frame to expand • AI-generated from your Veo3 prompt</div>
                  <FilmStrip frames={previewFrames} frameWidth={220} frameHeight={124} />
                </GlassCard>
              )}
              {/* Tech specs */}
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:12 }}>TECHNICAL PARAMETERS</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {Object.entries(result.technical_specs||{}).map(([k,v])=>(
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

              {/* Active prompt & Video Generation */}
              {platforms.map(p => p.id === activePrompt && result[p.key] && (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background:T.glass, border:`1px solid ${p.color}33`, borderRadius:14, padding:"16px 18px", position:"relative" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div style={{ fontSize:9, color:p.color, letterSpacing:2, fontWeight:700 }}>{p.label.toUpperCase()} PROMPT</div>
                      <button onClick={()=>copyPrompt(p.id, result[p.key])}
                        style={{ fontSize:11, color:copied===p.id?T.green:p.color, background:`${p.color}10`,
                          border:`1px solid ${p.color}33`, borderRadius:7, padding:"5px 12px", fontWeight:600 }}>
                        {copied===p.id?"✓ Copied!":"📋 Copy"}
                      </button>
                    </div>
                    <div style={{ fontSize:12.5, color:T.muted, lineHeight:1.85, whiteSpace:"pre-wrap",
                      fontFamily:"'JetBrains Mono',monospace", background:"rgba(255,255,255,0.02)",
                      borderRadius:10, padding:"12px", border:`1px solid ${T.border}` }}>
                      {result[p.key]}
                    </div>
                  </div>
                  
                  {/* Veo 3 Video Generator UI */}
                  {p.id === "veo3" && (
                    <GlassCard style={{ padding: "16px 18px", border: `1px solid ${T.teal}44` }}>
                      <div style={{ fontSize:9, color:T.teal, letterSpacing:2, fontWeight:700, marginBottom:12 }}>🎥 VEO 3 VIDEO RENDERER</div>
                      
                      {!generatingVideo && !videoResult && (
                        <button onClick={() => generateVideo(result[p.key])}
                          style={{ width:"100%", background:`linear-gradient(90deg, ${T.teal}22, ${T.tealL}44)`,
                            border:`1px solid ${T.teal}`, borderRadius:10, color:"#fff",
                            padding:"14px", fontSize:14, fontWeight:700, cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                          <span>🎬 Generate Real Video with Veo 3</span>
                        </button>
                      )}
                      
                      {generatingVideo && (
                        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", gap:16, border:`1px inset ${T.teal}33` }}>
                          <LoadingBox color={T.teal} label={statusText || "Rendering video..."} steps={[]} />
                        </div>
                      )}
                      
                      {videoResult && (
                        <div style={{ borderRadius:10, overflow:"hidden", border:`1px solid ${T.teal}55`, background:"#000", position:"relative", paddingTop:"56.25%" }}>
                          <video 
                            src={`data:${videoResult.mime};base64,${videoResult.b64}`}
                            autoPlay controls loop muted
                            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"contain" }}
                          />
                        </div>
                      )}
                    </GlassCard>
                  )}
                </div>
              ))}

              {/* Negative prompt */}
              {result.negative_prompt && (
                <div style={{ background:"rgba(192,41,58,0.06)", border:"1px solid rgba(192,41,58,0.18)", borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700 }}>⊘ NEGATIVE PROMPT</div>
                    <button onClick={()=>copyPrompt("neg", result.negative_prompt)}
                      style={{ fontSize:10, color:copied==="neg"?T.green:T.crimsonL, background:"rgba(192,41,58,0.08)",
                        border:"1px solid rgba(192,41,58,0.2)", borderRadius:6, padding:"3px 10px" }}>
                        {copied==="neg"?"✓ Copied!":"📋 Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize:12, color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>{result.negative_prompt}</div>
                </div>
              )}

              {/* Mood keywords */}
              {result.mood_keywords?.length>0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {result.mood_keywords.map(k=>(
                    <span key={k} style={{ fontSize:10.5, color:T.teal, background:T.tealGlow,
                      border:`1px solid ${T.teal}33`, borderRadius:20, padding:"3px 10px" }}>{k}</span>
                  ))}
                </div>
              )}

              {/* Prompt tips */}
              {result.prompt_tips?.length>0 && (
                <GlassCard style={{ padding:"14px 16px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:9 }}>💡 PROMPT ENGINEERING TIPS</div>
                  {result.prompt_tips.map((t,i)=>(
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
