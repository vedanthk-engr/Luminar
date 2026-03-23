import React from 'react';
import Spinner from './Spinner';
import styles from './LoadingBox.module.css';

export default function LoadingBox({ label = 'Processing...', steps = [], color = 'var(--gold)' }) {
  return (
    <div className={styles.box}>
      <Spinner color={color} />
      <div className={styles.label}>{label}</div>
      {steps.length > 0 && (
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={styles.step} 
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
