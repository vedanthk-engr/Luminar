import React from 'react';
import { useScriptAlchemist } from '../../hooks/useScriptAlchemist';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import ScoreBar from '../../components/ui/ScoreBar';
import LoadingBox from '../../components/ui/LoadingBox';
import CineImage from '../../components/ui/CineImage';
import { SAMPLE_SCRIPTS } from '../../constants/samples';
import { T } from '../../constants/theme';

export default function ScriptAlchemist() {
  const { text, setText, loading, result, error, analyze } = useScriptAlchemist();

  return (
    <div className="page-enter" style={{ padding:"40px 40px 60px" }}>
      <ModuleHeader color={T.gold} number="02" title="Script Alchemist"
        sub="Paste any screenplay, synopsis, or scene. LUMINARY returns genre classification, emotional arc analysis, budget estimation, production risk assessment, cinematic DNA references, and a full director's brief — all powered by real NLP intelligence."/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22, alignItems:"start" }}>
        <div>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder={"FADE IN:\n\nEXT. ROOFTOP - NIGHT\n\nPaste script, scene, or synopsis..."}
            style={{ width:"100%", height:320, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:14, color:T.text, fontSize:13, padding:"16px", lineHeight:1.8,
              fontFamily:"'JetBrains Mono',monospace", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=T.gold+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={analyze} disabled={loading||!text.trim()}
            style={{ marginTop:12, width:"100%",
              background:text.trim()&&!loading?`linear-gradient(135deg,${T.gold},#906010)`:"rgba(255,255,255,0.04)",
              color:text.trim()&&!loading?"#000":T.dim, border:"none", borderRadius:12,
              padding:"14px", fontSize:14, fontWeight:700, transition:"all 0.2s",
              animation:text.trim()&&!loading?"glowGold 3s ease-in-out infinite":"none" }}>
            {loading?"⚙️  Processing intelligence...":"⚗️  Run Full Script Analysis"}
          </button>
          {error && <div style={{ color:T.red, fontSize:12, padding:14, marginTop:10, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:9.5, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:10 }}>LOAD SAMPLE</div>
            {SAMPLE_SCRIPTS.map(s=>(
              <button key={s.label} onClick={()=>setText(s.text)}
                style={{ display:"block", width:"100%", textAlign:"left", marginBottom:5,
                  background:T.glass, border:`1px solid ${T.border}`, borderRadius:8,
                  padding:"10px 13px", color:T.muted, fontSize:12, transition:"all 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.gold+"44"; e.currentTarget.style.color=T.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
                <span style={{ color:T.gold, marginRight:7 }}>▶</span>{s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          {!result&&!loading&&!error && (
            <GlassCard style={{ minHeight:440, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <div style={{ fontSize:48, opacity:0.1 }}>⚗️</div>
              <div style={{ fontSize:13, color:T.dim }}>Results will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:440 }}><LoadingBox color={T.gold} label="Processing screenplay intelligence..." steps={["Reading narrative structure","Mapping emotional arcs","Evaluating risk factors","Matching cinematic DNA","Compiling director brief"]}/></GlassCard>}
          {result && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* AI Concept Poster */}
              {result.title && (
                <GlassCard style={{ padding:"14px" }}>
                  <div style={{ fontSize:9, color:T.gold, letterSpacing:2, fontWeight:700, marginBottom:10 }}>🎬 AI CONCEPT POSTER</div>
                  <CineImage
                    prompt={`movie poster, cinematic, ${result.title}, ${result.genre} film, ${result.tagline || result.logline?.slice(0,80)}, dramatic lighting, professional movie poster design, studio quality`}
                    width={600} height={340} seed={7}
                    style={{ borderRadius:10 }}
                  />
                </GlassCard>
              )}
              <GlassCard style={{ padding:"18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>{result.title}</div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{result.genre}{result.subgenre?` · ${result.subgenre}`:""} · {result.budget_tier} · {result.estimated_budget_usd}</div>
                    {result.tagline && <div style={{ fontSize:12, color:T.gold, fontStyle:"italic", marginTop:6 }}>"{result.tagline}"</div>}
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:28, fontWeight:900, color:T.gold, fontFamily:"'Cinzel Decorative',serif" }}>{result.scores?.audience_engagement}</div>
                    <div style={{ fontSize:9, color:T.muted }}>ENGAGEMENT</div>
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:T.muted, fontStyle:"italic", lineHeight:1.75, paddingTop:10, borderTop:`1px solid ${T.border}` }}>"{result.logline}"</div>
              </GlassCard>
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:14 }}>INTELLIGENCE SCORES</div>
                {Object.entries(result.scores||{}).map(([k,v],i)=>(
                  <ScoreBar key={k} label={k.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                    val={v} color={[T.gold,T.violetL,T.tealL,T.skyL,T.crimsonL,T.amber,T.green][i%7]} delay={i*60}/>
                ))}
              </GlassCard>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:"rgba(23,163,97,0.07)", border:"1px solid rgba(23,163,97,0.15)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:9, color:T.green, letterSpacing:2, fontWeight:700, marginBottom:8 }}>STRENGTHS</div>
                  {(result.strengths||[]).map((s,i)=><div key={i} style={{ fontSize:11.5, color:T.muted, marginBottom:5, display:"flex", gap:7 }}><span style={{ color:T.green, flexShrink:0 }}>✓</span>{s}</div>)}
                </div>
                <div style={{ background:"rgba(192,41,58,0.07)", border:"1px solid rgba(192,41,58,0.15)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:9, color:T.crimsonL, letterSpacing:2, fontWeight:700, marginBottom:8 }}>RISKS</div>
                  {(result.risks||[]).map((r,i)=><div key={i} style={{ fontSize:11.5, color:T.muted, marginBottom:5, display:"flex", gap:7 }}><span style={{ color:T.amber, flexShrink:0 }}>!</span>{r}</div>)}
                  {(result.missing_elements||[]).map((r,i)=><div key={`m${i}`} style={{ fontSize:11.5, color:T.muted, marginBottom:5, display:"flex", gap:7 }}><span style={{ color:T.red, flexShrink:0 }}>⊘</span>{r}</div>)}
                </div>
              </div>
              {result.cinematic_references?.length>0 && (
                <GlassCard style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700, marginBottom:8 }}>CINEMATIC DNA</div>
                  <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                    {result.cinematic_references.map(r=>(
                      <span key={r} style={{ fontSize:11, color:T.muted, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:6, padding:"3px 10px" }}>🎬 {r}</span>
                    ))}
                  </div>
                </GlassCard>
              )}
              <div style={{ background:"rgba(98,65,181,0.07)", border:"1px solid rgba(98,65,181,0.2)", borderRadius:10, padding:"14px 18px" }}>
                <div style={{ fontSize:9, color:T.violetL, letterSpacing:2, fontWeight:700, marginBottom:7 }}>DIRECTOR'S BRIEF</div>
                <div style={{ fontSize:13, color:T.muted, lineHeight:1.8 }}>{result.recommendation}</div>
                <div style={{ marginTop:8, fontSize:12, color:T.text }}>
                   {result.director_match?.map((d,i)=><div key={i}>Match: {d}</div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
