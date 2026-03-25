import React from 'react';
import styles from './FilmTicker.module.css';

const TICKER_ITEMS = [
  "SCENE COMPUTATION",
  "NARRATIVE ANALYSIS",
  "EMOTIONAL MAPPING",
  "VISION AI",
  "CINEMATOGRAPHY",
  "STORY ARC",
  "CHARACTER DEPTH",
  "LIGHTING PROFILE",
  "COLOR GRADING",
  "LENS SELECTION",
  "SOUND DESIGN",
  "FESTIVAL STRATEGY"
];

// Content array doubled for seamless loop (24 items total)
const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function FilmTicker() {
  const items = ["LUMINARY v2","SCENE AUTOPSY","SHOT COMPOSER","FESTIVAL ORACLE","VEO3 STUDIO","EMOTI CINE","SCRIPT ALCHEMIST","CINEACCESS","CINECHAT","CODEFLIX 2026","VIT CHENNAI","OPEN INNOVATION"];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid var(--border)`, borderBottom:`1px solid var(--border)`, padding:"9px 0", background:"rgba(2,2,8,0.6)" }}>
      <div style={{ display:"flex", animation:"filmRoll 20s linear infinite", width:"max-content" }}>
        {[...items,...items].map((l,i)=>(
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:14, paddingRight:20 }}>
            <span style={{ display:"inline-block", width:14, height:14, borderRadius:3, border:`1.5px solid var(--dim)`, opacity:0.4, animation:`frameFlash 3s ${i*0.2}s ease-in-out infinite` }}/>
            <span style={{ fontSize:9, letterSpacing:3.5, color:'var(--dim)', fontFamily:"'Cinzel Decorative',serif" }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
