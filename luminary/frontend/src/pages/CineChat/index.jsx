import React, { useRef, useEffect } from 'react';
import { useCineChat } from '../../hooks/useCineChat';
import ModuleHeader from '../../components/ui/ModuleHeader';
import { T } from '../../constants/theme';

const QUICK_Q = [
  "How do I write a perfect opening scene?","What makes scripts commercially viable?",
  "Explain the hero's journey vs Save the Cat","How is Veo3 changing indie filmmaking?",
  "Best OTT vs festival strategy for indie films?","What is the golden ratio in cinematography?",
  "How do I write subtext-heavy dialogue?","Tamil cinema's global breakthrough formula?"
];

export default function CineChat() {
  const { msgs, inp, setInp, loading, send } = useCineChat();
  const ref = useRef();
  
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

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
          <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:14 }}>
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
            border:"none", color:inp.trim()&&!loading?"#fff":T.dim, borderRadius:11, padding:"13px 20px", fontSize:16, fontWeight:700, transition:"all 0.2s", cursor:inp.trim()&&!loading?"pointer":"default" }}>→</button>
      </div>
    </div>
  );
}
