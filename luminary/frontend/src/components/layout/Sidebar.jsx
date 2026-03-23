import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TABS } from '../../constants/tabs';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside style={{ width:230, position:"fixed", left:0, top:0, bottom:0, zIndex:200,
      background:"rgba(2,2,8,0.97)", borderRight:`1px solid var(--border)`,
      backdropFilter:"blur(20px)", display:"flex", flexDirection:"column" }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 18px", borderBottom:`1px solid var(--border)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:34, height:34, borderRadius:9,
            background:`linear-gradient(135deg, var(--gold), var(--violet))`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✦</div>
          <div>
            <div style={{ fontSize:13, fontFamily:"'Cinzel Decorative',serif", color:'var(--text)', letterSpacing:2.5, fontWeight:700 }}>LUMINARY</div>
            <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:2, marginTop:1 }}>CINEMA AI v2.0</div>
          </div>
        </div>
        <div style={{ background:"linear-gradient(135deg,rgba(200,148,26,0.1),rgba(98,65,181,0.07))",
          border:"1px solid rgba(200,148,26,0.2)", borderRadius:9, padding:"8px 12px" }}>
          <div style={{ fontSize:8.5, color:'var(--gold)', letterSpacing:3, fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>CODEFLIX 2026</div>
          <div style={{ fontSize:11, color:'var(--gold-l)', fontWeight:700, marginTop:3 }}>TRACK 5 · OPEN INNOVATION</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ fontSize:8.5, color:'var(--dim)', letterSpacing:2.5, fontWeight:700, padding:"4px 10px 10px" }}>9 AI MODULES</div>
        {TABS.map(t=>{
          const isActive = t.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(t.path);
          return (
            <NavLink key={t.id} to={t.path}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:9,
                textDecoration:"none", border:"none", background:isActive ? `linear-gradient(135deg,${t.color}14,${t.color}07)` : "transparent",
                borderLeft:`2px solid ${isActive ? t.color : "transparent"}`, textAlign:"left", width:"100%", transition:"all 0.15s" }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='var(--glass)'; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:15, minWidth:20, textAlign:"center" }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:11.5, fontWeight:isActive?700:500, color:isActive?t.color:'var(--muted)' }}>{t.label}</div>
                <div style={{ fontSize:9.5, color:'var(--dim)', marginTop:1 }}>{t.sub}</div>
              </div>
            </NavLink>
          );
        })}
      </nav>
      {/* Footer */}
      <div style={{ padding:"14px 20px", borderTop:`1px solid var(--border)` }}>
        <div style={{ fontSize:9.5, color:'var(--dim)', lineHeight:1.8 }}>Claude Sonnet API · Real AI<br/>No fake/hardcoded outputs<br/>VIT Chennai · March 23–27</div>
        <div style={{ marginTop:8, display:"flex", gap:4, flexWrap:"wrap" }}>
          {["AI","Vision","NLP","GenAI","RAG"].map(x=>(
            <span key={x} style={{ fontSize:8.5, color:'var(--violet)', background:"rgba(98,65,181,0.1)",
              border:"1px solid rgba(98,65,181,0.18)", borderRadius:4, padding:"1.5px 5px", fontWeight:700 }}>{x}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
