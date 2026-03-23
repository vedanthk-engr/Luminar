import React from 'react';
import { useShotComposer } from '../../hooks/useShotComposer';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import LoadingBox from '../../components/ui/LoadingBox';
import CineImage from '../../components/ui/CineImage';
import { T } from '../../constants/theme';

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
      {/* AI storyboard thumbnail */}
      <div style={{ padding:"0 14px", paddingTop:10 }}>
        <CineImage
          prompt={`cinematic film still, ${shot.shot_type} ${shot.angle}, ${shot.description?.slice(0,120)}, ${shot.lighting}, movie scene, professional cinematography`}
          width={400} height={200} seed={42 + (shot.shot_number || i)}
          style={{ borderRadius:8, marginBottom:8 }}
        />
      </div>
      <div style={{ padding:"8px 14px 12px" }}>
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

export default function ShotComposer() {
  const { desc, setDesc, loading, result, error, generate } = useShotComposer();

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
          {error && <div style={{ color:T.red, fontSize:12, padding:14, marginTop:10, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
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
          {!result&&!loading&&!error && (
            <GlassCard style={{ minHeight:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>🎥</div>
              <div style={{ fontSize:13, color:T.dim }}>Your shot list storyboard will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:400 }}><LoadingBox color={T.skyL} label="Composing shots with AI director..." steps={["Planning narrative structure","Selecting camera positions","Choosing lens configurations","Designing lighting setups","Choreographing camera movement"]}/></GlassCard>}
          {result && (
            <div>
              {/* Scene header */}
              <div style={{ background:T.glass, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 20px", marginBottom:16,
                display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:T.text, fontFamily:"'Cinzel Decorative',serif" }}>{result.scene_title}</div>
                  <div style={{ display:"flex", gap:10, marginTop:8 }}>
                    {[{l:"Mood",v:result.scene_mood,c:T.violetL},{l:"Lens",v:result.suggested_lens,c:T.gold}].map(x=>(
                      <span key={x.l} style={{ fontSize:10.5, color:x.c, background:`${x.c}0f`, border:`1px solid ${x.c}33`, borderRadius:6, padding:"3px 10px" }}>{x.l}: {x.v}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:8, lineHeight:1.6 }}>🎨 Grade: {result.color_grade}</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:T.skyL, fontFamily:"'Cinzel Decorative',serif" }}>{result.shots?.length}</div>
                  <div style={{ fontSize:9, color:T.muted }}>SHOTS</div>
                </div>
              </div>
              {/* Shot list */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                {(result.shots||[]).map((shot,i)=><ShotCard key={i} shot={shot} i={i}/>)}
              </div>
              {/* Director's note */}
              {result.director_note && (
                <div style={{ background:"rgba(98,65,181,0.07)", border:"1px solid rgba(98,65,181,0.2)", borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontSize:9, color:T.violetL, letterSpacing:2, fontWeight:700, marginBottom:7 }}>DIRECTOR'S INTENT</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.8 }}>{result.director_note}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
