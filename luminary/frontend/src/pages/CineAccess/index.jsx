import React, { useState } from 'react';
import { useCineAccess } from '../../hooks/useCineAccess';
import ModuleHeader from '../../components/ui/ModuleHeader';
import Spinner from '../../components/ui/Spinner';
import { T } from '../../constants/theme';

const ACCESS_MODES = [
  { id:"audio", icon:"🔊", label:"Audio Description", sub:"Blind & low-vision", color:T.teal },
  { id:"cognitive", icon:"🧩", label:"Cognitive Mode", sub:"Neurodivergent viewers", color:T.gold },
  { id:"cultural", icon:"🌍", label:"Cultural Notes", sub:"Global adaptation", color:T.violetL },
  { id:"sign", icon:"🈳", label:"Sign Language Notes", sub:"Deaf communities", color:T.skyL },
];

export default function CineAccess() {
  const { mode, setMode, input, setInput, loading, output, error, generate } = useCineAccess();
  const [speaking, setSpeaking] = useState(false);
  const cm = ACCESS_MODES.find(m => m.id === mode) || ACCESS_MODES[0];

  const outputText = output ? (output.output || output.audio_description || output.cognitive_translation || output.cultural_notes || output.sign_language_cues || '') : '';

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!outputText) return;
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="page-enter" style={{ padding:"40px 40px 60px" }}>
      <ModuleHeader color={T.teal} number="07" title="CineAccess Studio"
        sub="Break every barrier cinema has ever built. AI generates professional-grade audio descriptions, cognitive adaptations, cultural localization notes, and deaf community adaptations — opening your film to 2.2 billion people globally."/>
      
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:22 }}>
        {ACCESS_MODES.map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)}
            style={{ textAlign:"left", background:mode===m.id?`${m.color}12`:T.glass,
              border:`1px solid ${mode===m.id?m.color+"44":T.border}`, borderRadius:12, padding:"14px" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
            <div style={{ fontSize:12, fontWeight:700, color:mode===m.id?m.color:T.text, marginBottom:3 }}>{m.label}</div>
            <div style={{ fontSize:10, color:T.dim }}>{m.sub}</div>
          </button>
        ))}
      </div>
      
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            placeholder="Describe a film scene in detail..."
            style={{ width:"100%", height:240, background:T.glass, border:`1px solid ${T.border}`,
              borderRadius:12, color:T.text, fontSize:13, padding:"14px", lineHeight:1.8,
              fontFamily:"'Outfit',sans-serif", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=cm.color+"55"}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          
          <button onClick={generate} disabled={loading||!input.trim()}
            style={{ marginTop:12, width:"100%",
              background:input.trim()&&!loading?`linear-gradient(135deg,${cm.color},${cm.color}88)`:"rgba(255,255,255,0.04)",
              color:input.trim()&&!loading?"#000":T.dim, border:"none", borderRadius:12,
              padding:"13px", fontSize:14, fontWeight:700, transition:"all 0.2s" }}>
            {loading?`⚙️  Generating ${cm.label}...`:`♿  Generate ${cm.label}`}
          </button>
          
          {error && <div style={{ color:T.red, fontSize:12, padding:14, marginTop:10, background:"rgba(212,64,80,0.08)", borderRadius:10, border:`1px solid rgba(212,64,80,0.2)` }}>{error}</div>}
        </div>
        
        <div style={{ background:T.glass, border:`1px solid ${loading?cm.color+"44":T.border}`, borderRadius:12, padding:"16px", minHeight:280, transition:"border 0.3s", overflowY:"auto" }}>
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:14 }}>
              <Spinner color={cm.color}/>
              <div style={{ fontSize:12, color:T.muted }}>Generating {cm.label}...</div>
            </div>
          )}
          {!loading && !outputText && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:10 }}>
              <div style={{ fontSize:38, opacity:0.1 }}>{cm.icon}</div>
              <div style={{ fontSize:12, color:T.dim }}>Output appears here</div>
            </div>
          )}
          {outputText && (
            <div>
              {/* Text-to-Speech control for Audio mode */}
              {mode === "audio" && (
                <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                  <button onClick={handleSpeak}
                    style={{
                      display:"flex", alignItems:"center", gap:8,
                      background:speaking?`${T.crimsonL}18`:`${T.teal}18`,
                      border:`1px solid ${speaking?T.crimsonL+"44":T.teal+"44"}`,
                      borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700,
                      color:speaking?T.crimsonL:T.teal, transition:"all 0.2s",
                      animation:speaking?"glowGold 2s ease-in-out infinite":"none"
                    }}>
                    {speaking ? "⏹ Stop Narration" : "▶ Play Audio Description"}
                  </button>
                  {speaking && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.teal }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:T.teal, animation:"pulse 1s infinite" }}/>
                      Speaking...
                    </div>
                  )}
                </div>
              )}
              <div style={{ fontSize:13, color:T.muted, lineHeight:1.9, whiteSpace:"pre-wrap" }}>
                {outputText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

