import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ color = 'var(--gold)', size = 38 }) {
  return (
    <div 
      className={styles.spinner} 
      style={{ 
        width: size, 
        height: size, 
        borderColor: color,
        borderTopColor: 'transparent'
      }} 
    />
  );
}
