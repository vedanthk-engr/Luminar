import React from 'react';
import styles from './Background.module.css';

export default function Background() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:-1, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", inset:0, background:`
        radial-gradient(ellipse 70% 60% at 15% 10%, rgba(98,65,181,0.07) 0%, transparent 65%),
        radial-gradient(ellipse 60% 50% at 88% 80%, rgba(200,148,26,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 50% 45% at 55% 45%, rgba(24,168,154,0.04) 0%, transparent 55%),
        radial-gradient(ellipse 40% 35% at 30% 70%, rgba(192,41,58,0.04) 0%, transparent 55%)` }}/>
      {[[700,700,-250,-120,"rgba(98,65,181,0.065)","orb1 24s"],
        [580,580,-150,-120,"rgba(200,148,26,0.055)","orb2 30s"],
        [420,420,200,300,"rgba(24,168,154,0.045)","orb3 19s 8s"]].map(([w,h,t,l,c,a],i)=>(
        <div key={i} style={{ position:"absolute", width:w, height:h, borderRadius:"50%", top:t, left:l,
          background:`radial-gradient(circle, ${c} 0%, transparent 65%)`, animation:`${a} ease-in-out infinite` }}/>
      ))}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.03 }}>
        <filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 85% at 50% 50%, transparent 45%, rgba(2,2,8,0.55) 100%)" }}/>
    </div>
  );
}
