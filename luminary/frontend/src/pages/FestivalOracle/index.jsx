import React from 'react';
import { useFestivalOracle } from '../../hooks/useFestivalOracle';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import LoadingBox from '../../components/ui/LoadingBox';
import { T } from '../../constants/theme';

export default function FestivalOracle() {
  const { form, updateForm, loadSample, loading, result, error, analyze } = useFestivalOracle();

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
              <input value={form[f.k]} onChange={e=>updateForm(f.k, e.target.value)}
                placeholder={f.ph} style={{ width:"100%", background:T.glass, border:`1px solid ${T.border}`,
                  borderRadius:9, color:T.text, fontSize:13, padding:"10px 12px", transition:"border 0.2s" }}
                onFocus={e=>e.target.style.borderColor=T.amber+"55"}
                onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          ))}
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:500 }}>Synopsis (brief)</div>
            <textarea value={form.synopsis} onChange={e=>updateForm('synopsis', e.target.value)}
              placeholder="What is your film about? Core themes, story, tone..."
              style={{ width:"100%", height:100, background:T.glass, border:`1px solid ${T.border}`,
                borderRadius:9, color:T.text, fontSize:13, padding:"10px 12px", lineHeight:1.7, transition:"border 0.2s",
                fontFamily:"'Outfit',sans-serif" }}
              onFocus={e=>e.target.style.borderColor=T.amber+"55"}
              onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <button onClick={analyze} disabled={loading||!form.synopsis.trim()}
            style={{ width:"100%", background:form.synopsis.trim()&&!loading?`linear-gradient(135deg,${T.amber},#7a4a08)`:"rgba(255,255,255,0.04)",
              color:form.synopsis.trim()&&!loading?"#fff":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?"⚙️  Mapping festival circuit...":"🏆  Generate Festival Strategy"}
          </button>
          {error && <div style={{ color:T.red, fontSize:12, padding:14, marginTop:10, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
          <button onClick={()=>loadSample({ title:"The Glass Sea", genre:"Drama", runtime:"94", country:"India", language:"Tamil with English subtitles", budget:"$400K micro-budget", synopsis:"A deaf fisherman on the Tamil Nadu coast discovers an encrypted distress signal that leads him to a sunken research vessel. As he investigates, he uncovers a corporate conspiracy that threatens the coastal community — but his disability means no one believes him." })}
            style={{ marginTop:8, width:"100%", background:T.glass, border:`1px solid ${T.border}`,
              color:T.muted, borderRadius:10, padding:"10px", fontSize:12 }}>
            Load Sample Project
          </button>
        </div>

        <div>
          {!result&&!loading&&!error && (
            <GlassCard style={{ minHeight:480, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:46, opacity:0.1 }}>🏆</div>
              <div style={{ fontSize:13, color:T.dim, textAlign:"center" }}>Your festival circuit strategy will appear here</div>
            </GlassCard>
          )}
          {loading && <GlassCard style={{ minHeight:480 }}><LoadingBox color={T.amber} label="Mapping your festival circuit..." steps={["Analyzing project profile","Searching 500+ global festivals","Calculating acceptance probabilities","Building circuit strategy","Generating submission tips"]}/></GlassCard>}
          {result && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <GlassCard style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:9, color:T.dim, letterSpacing:2, fontWeight:700 }}>PROJECT ASSESSMENT</div>
                  <span style={{ fontSize:11, fontWeight:700, color:tierColors[result.tier]||T.gold,
                    background:`${tierColors[result.tier]||T.gold}12`, border:`1px solid ${tierColors[result.tier]||T.gold}33`,
                    borderRadius:6, padding:"3px 10px" }}>{result.tier}</span>
                </div>
                <div style={{ fontSize:13, color:T.muted, lineHeight:1.75, marginBottom:10 }}>{result.project_assessment}</div>
                <div style={{ fontSize:12, color:T.amber, fontStyle:"italic" }}>Strategy: {result.strategy}</div>
              </GlassCard>

              {(result.festivals||[]).map((f,i)=>(
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

              {result.marketing_angle && (
                <GlassCard style={{ padding:"14px 16px", background:"rgba(200,148,26,0.06)" }}>
                  <div style={{ fontSize:9, color:T.gold, letterSpacing:2, fontWeight:700, marginBottom:7 }}>MARKETING ANGLE</div>
                  <div style={{ fontSize:13, color:T.muted, lineHeight:1.75 }}>{result.marketing_angle}</div>
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
