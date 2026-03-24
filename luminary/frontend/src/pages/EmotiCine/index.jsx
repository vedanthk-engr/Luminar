import React, { useState } from 'react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import GlassCard from '../../components/ui/GlassCard';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { T } from '../../constants/theme';

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

export default function EmotiCine() {
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
    <div className="page-enter" style={{ padding:"40px 40px 60px" }}>
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
