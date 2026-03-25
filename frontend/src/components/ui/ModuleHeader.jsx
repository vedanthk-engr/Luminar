import React from 'react';
import styles from './ModuleHeader.module.css';

export default function ModuleHeader({ number, title, sub, subtitle, color }) {
  const displaySub = sub || subtitle;
  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        {number && (
          <span className={styles.moduleNumber} style={{ color }}>
            ✦ MODULE {number}
          </span>
        )}
        <div 
          className={styles.rule} 
          style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} 
        />
      </div>
      <h2 className={styles.title}>{title}</h2>
      {displaySub && <p className={styles.subtitle}>{displaySub}</p>}
    </div>
  );
}
