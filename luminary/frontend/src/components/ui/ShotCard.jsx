import React from 'react';
import styles from './ShotCard.module.css';

export default function ShotCard({ shot, index }) {
  return (
    <div 
      className={styles.card} 
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className={styles.headerBand}>
        <div className={styles.badge}>{String(shot.shot_number).padStart(2, '0')}</div>
        <div className={styles.metaRow}>
          <span className={styles.shotType}>{shot.shot_type}</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.angle}>{shot.angle}</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.duration}>{shot.duration_seconds}s</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.lens}>{shot.lens}</span>
        </div>
      </div>
      
      <div className={styles.body}>
        <p className={styles.description}>{shot.description}</p>
        
        <div className={styles.pills}>
          <div className={styles.pill}>
            <span className={styles.pillLabel}>MOTION</span>
            {shot.movement}
          </div>
          <div className={styles.pill}>
            <span className={styles.pillLabel}>EMOTION</span>
            {shot.emotion}
          </div>
        </div>

        <div className={styles.lightingNote}>
          <span className={styles.lightIcon}>💡</span> 
          {shot.lighting}
        </div>
      </div>
    </div>
  );
}
