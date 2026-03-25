import React, { useState, useEffect, useRef } from 'react';
import styles from './CineImage.module.css';

/* Colour palette for cinematic frames */
const PALETTES = [
  ['#0a1628', '#1a2a4a', '#2d4a7a', '#c2a060', '#e8d5a8'],
  ['#1a0a0a', '#3a1515', '#6a2020', '#c04040', '#e8a0a0'],
  ['#0a1a0a', '#152a15', '#204020', '#40a040', '#a0e8a0'],
  ['#1a1a28', '#2a2a4a', '#40407a', '#8080c0', '#c0c0e8'],
  ['#1a180a', '#2a2815', '#4a4020', '#8a7040', '#c8b080'],
  ['#0a1a1a', '#152a2a', '#204a4a', '#40a0a0', '#a0e8e8'],
  ['#180a1a', '#2a152a', '#4a204a', '#a040a0', '#e8a0e8'],
  ['#1a1210', '#2a2018', '#4a3828', '#8a6848', '#c8a880'],
];

/**
 * Hash a string to a number for deterministic palette/composition selection.
 */
function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Draw a procedural cinematic frame on a canvas.
 */
function drawCinematicFrame(canvas, prompt, seed) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const hash = hashStr(prompt + seed);
  const palette = PALETTES[hash % PALETTES.length];

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, palette[0]);
  bg.addColorStop(0.5, palette[1]);
  bg.addColorStop(1, palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Atmospheric layers
  for (let i = 0; i < 5; i++) {
    const y = (h * 0.2) + (i * h * 0.15);
    const grad = ctx.createLinearGradient(0, y - 20, 0, y + 40);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, palette[2] + '30');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 20, w, 60);
  }

  // Cinematic light source
  const lx = (hash % 3 === 0) ? w * 0.2 : (hash % 3 === 1) ? w * 0.5 : w * 0.8;
  const ly = h * 0.3;
  const lightGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.6);
  lightGrad.addColorStop(0, palette[3] + '40');
  lightGrad.addColorStop(0.4, palette[3] + '15');
  lightGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, w, h);

  // Compositional elements - abstract shapes suggesting scene
  const shapes = 3 + (hash % 4);
  for (let i = 0; i < shapes; i++) {
    const sx = ((hash * (i + 1) * 137) % w);
    const sy = h * 0.4 + ((hash * (i + 1) * 89) % (h * 0.4));
    const sw = 40 + ((hash * (i + 1) * 53) % 120);
    const sh = 60 + ((hash * (i + 1) * 67) % 100);
    
    ctx.fillStyle = palette[1] + '60';
    ctx.beginPath();
    ctx.roundRect(sx - sw/2, sy - sh/2, sw, sh, 4);
    ctx.fill();
    
    // Highlight edge
    ctx.strokeStyle = palette[3] + '20';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Silhouette horizon
  ctx.fillStyle = palette[0] + 'cc';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.75);
  for (let x = 0; x <= w; x += 20) {
    const variance = Math.sin((x + hash) * 0.02) * 15 + Math.sin((x + hash) * 0.05) * 8;
    ctx.lineTo(x, h * 0.75 + variance);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Film grain overlay
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);

  // Letterbox bars
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h * 0.06);
  ctx.fillRect(0, h * 0.94, w, h * 0.06);

  // Vignette
  const vig = ctx.createRadialGradient(w/2, h/2, w*0.25, w/2, h/2, w*0.7);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

export default function CineImage({ prompt, width = 768, height = 432, seed = 42, label, style = {}, onClick }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadAiImage = async () => {
      if (!prompt) return;
      setLoading(true);
      setError(false);
      try {
        const res = await fetch('/api/images/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspect_ratio: "16:9" })
        });
        const data = await res.json();
        if (active) {
          if (data.image_b64) {
            setImgUrl(`data:image/jpeg;base64,${data.image_b64}`);
          } else {
            console.warn("AI Image failed, falling back to canvas");
            setError(true);
            drawFallback();
          }
        }
      } catch (err) {
        console.error("Image fetch error:", err);
        if (active) {
          setError(true);
          drawFallback();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const drawFallback = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        drawCinematicFrame(canvas, prompt, seed);
      }
    };

    loadAiImage();
    return () => { active = false; };
  }, [prompt, width, height, seed]);

  return (
    <div className={`${styles.cineImageWrap} ${loading ? styles.loading : ''}`} 
      style={{ width: '100%', aspectRatio: `${width}/${height}`, position: 'relative', overflow: 'hidden', ...style }} 
      onClick={onClick}>
      
      {imgUrl && !loading ? (
        <img src={imgUrl} alt={prompt} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', animation: 'fadeUp 0.6s ease forwards' }} />
      ) : (
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', borderRadius: 'inherit', filter: loading ? 'blur(10px) grayscale(1)' : 'none', transition: 'all 0.5s' }}
        />
      )}

      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {label && <div className={styles.filmLabel}>{label}</div>}
    </div>
  );
}

/**
 * FilmStrip — Horizontal strip of cinematic frames.
 */
export function FilmStrip({ frames, frameWidth = 280, frameHeight = 160 }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <div className={styles.filmStrip}>
        {frames.map((f, i) => (
          <div key={i} className={styles.filmFrame} style={{ width: frameWidth }}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <CineImage
              prompt={f.prompt}
              width={frameWidth * 2}
              height={frameHeight * 2}
              seed={f.seed || (42 + i)}
              label={f.label || `Frame ${i + 1}`}
              style={{ borderRadius: 10 }}
            />
          </div>
        ))}
      </div>
      {expanded !== null && (
        <div style={{
          marginTop: 12, borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'fadeUp 0.3s ease forwards'
        }}
          onClick={() => setExpanded(null)}>
          <CineImage
            prompt={frames[expanded].prompt}
            width={1024}
            height={576}
            seed={frames[expanded].seed || (42 + expanded)}
            label={frames[expanded].label || `Frame ${expanded + 1}`}
            style={{ cursor: 'zoom-out' }}
          />
        </div>
      )}
    </>
  );
}
