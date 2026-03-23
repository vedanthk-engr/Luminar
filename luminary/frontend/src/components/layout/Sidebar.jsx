import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  FlaskConical, 
  Brain, 
  Video, 
  Sparkles, 
  Trophy, 
  Accessibility, 
  MessageSquare 
} from 'lucide-react';
import { TABS } from '../../constants/tabs';
import styles from './Sidebar.module.css';

const ICON_MAP = {
  home: LayoutDashboard,
  scene: Film,
  script: FlaskConical,
  emotion: Brain,
  shots: Video,
  veo: Sparkles,
  festival: Trophy,
  access: Accessibility,
  chat: MessageSquare,
};

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside style={{ width:230, position:"fixed", left:0, top:0, bottom:0, zIndex:200,
      background:"rgba(2,2,8,0.97)", borderRight:`1px solid var(--border)`,
      backdropFilter:"blur(20px)", display:"flex", flexDirection:"column" }}>
      {/* Logo Section */}
      <div style={{ padding:"24px 20px 24px", borderBottom:`1px solid var(--border)` }}>
        <div style={{ fontSize:16, fontFamily:"'Cinzel Decorative',serif", color:'var(--text)', letterSpacing:3, fontWeight:700 }}>
          LUMINARY
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"20px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ fontSize:7.5, color:'var(--gold)', letterSpacing:1.5, fontWeight:700, padding:"4px 12px 16px",
          fontFamily:"'Cinzel Decorative',serif", lineHeight:1.4, opacity:0.8 }}>
          THE WORLD'S FIRST NEURO-CINEMATIC INTELLIGENCE PLATFORM
        </div>
        {TABS.map(t => {
          const isActive = t.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(t.path);
          const Icon = ICON_MAP[t.id];
          
          return (
            <NavLink key={t.id} to={t.path}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:9,
                textDecoration:"none", border:"none", background:isActive ? `linear-gradient(135deg,${t.color}14,${t.color}07)` : "transparent",
                borderLeft:`2px solid ${isActive ? t.color : "transparent"}`, textAlign:"left", width:"100%", transition:"all 0.15s" }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='var(--glass)'; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}>
              {Icon && <Icon size={18} color={isActive ? t.color : 'var(--dim)'} strokeWidth={1.5} />}
              <div>
                <div style={{ fontSize:12, fontWeight:isActive?700:500, color:isActive?t.color:'var(--muted)' }}>{t.label}</div>
                <div style={{ fontSize:10, color:'var(--dim)', marginTop:1 }}>{t.sub}</div>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:"20px", borderTop:`1px solid var(--border)`, textAlign:"center" }}>
        <div style={{ fontSize:10, color:'var(--dim)', fontWeight:600, letterSpacing:1 }}>
          LUMINARY © 2026
        </div>
      </div>
    </aside>
  );
}
