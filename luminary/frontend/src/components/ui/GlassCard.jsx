import React, { useState } from 'react';
import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', accentColor, onClick }) {
  const [hover, setHover] = useState(false);
  const clickable = !!onClick;
  
  const customStyles = {
    ...(hover && accentColor ? { borderColor: `${accentColor}70` } : {})
  };

  return (
    <div 
      className={`${styles.card} ${clickable ? styles.clickable : ''} ${className}`}
      style={customStyles}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
}
