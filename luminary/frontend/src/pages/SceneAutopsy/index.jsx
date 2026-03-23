import React, { useRef } from 'react';
import { useSceneAutopsy } from '../../hooks/useSceneAutopsy';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import ScoreBar from '../../components/ui/ScoreBar';
import LoadingBox from '../../components/ui/LoadingBox';
import CineImage from '../../components/ui/CineImage';
import { SAMPLE_SCENES } from '../../constants/samples';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { T } from '../../constants/theme';

export default function SceneAutopsy() {
  const { mode, setMode, img, preview, desc, setDesc, loading, result, error, handleFile, clearImage, analyze } = useSceneAutopsy();
  const dropRef = useRef();

  const onDrop = e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };

  const scoreItems = result?.scores ? [
    { l:"Cinematography",      v:result.scores.cinematography,       c:T.gold },
    { l:"Lighting Design",     v:result.scores.lighting,             c:T.amber },
    { l:"Composition",         v:result.scores.composition,          c:T.crimsonL },
    { l:"Narrative Power",     v:result.scores.narrative_power,      c:T.violetL },
    { l:"Emotional Impact",    v:result.scores.emotional_impact,     c:T.skyL },
    { l:"Technical Execution", v:result.scores.technical_execution,  c:T.tealL },
    { l:"Color Grade",         v:result.scores.color_grade,          c:T.green },
  ] : [];

  const radarData = result?.scores ? [
    { subject:"Cinemat.", A:result.scores.cinematography },
    { subject:"Lighting", A:result.scores.lighting },
    { subject:"Composition", A:result.scores.composition },
    { subject:"Narrative", A:result.scores.narrative_power },
    { subject:"Emotion", A:result.scores.emotional_impact },
    { subject:"Color", A:result.scores.color_grade },
  ] : [];

  return (
    <div style={{ padding:"40px 40px 60px", animation:"fadeUp 0.4s ease forwards" }}>
      <ModuleHeader badge="SCENE AUTOPSY" color={T.crimsonL} number="01" title="Scene Autopsy"
        sub="Upload a movie still or scene screenshot — or describe a scene — and LUMINARY's Vision AI delivers a frame-by-frame professional film critic analysis: cinematography breakdown, lighting dissection, narrative function, emotional palette, and specific improvement suggestions." />

      {/* Mode switch */}
      <div style={{ display:"flex", gap:8, marginBottom:22 }}>
        {[{id:"upload",l:"📎 Upload Scene Image"},{id:"describe",l:"✏️ Describe a Scene"}].map(m=>(
          <button key={m.id} onClick={()=>{ setMode(m.id); }}
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
                <input id="fileIn" type="file" accept="image/*" style={{ display:"none" }} onChange={e=> { if(e.target.files[0]) handleFile(e.target.files[0]); }}/>
              </div>
              {preview && (
                <button onClick={clearImage}
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
                {SAMPLE_SCENES.map((s,i)=>(
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
              {/* AI Scene Visualization (text mode only) */}
              {mode === "describe" && desc && (
                <GlassCard style={{ padding:"14px" }}>
                  <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700, marginBottom:10 }}>🎨 AI SCENE VISUALIZATION</div>
                  <CineImage
                    prompt={`cinematic film still, ${desc.slice(0, 180)}, professional cinematography, dramatic lighting, movie scene, 35mm film`}
                    width={700} height={380} seed={33}
                    style={{ borderRadius:10 }}
                  />
                </GlassCard>
              )}
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
