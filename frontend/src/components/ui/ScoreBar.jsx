import { useState, useEffect } from 'react'
import styles from './ScoreBar.module.css'

export default function ScoreBar({ label, val, color, delay = 0 }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(val), 100 + delay)
    return () => clearTimeout(t)
  }, [val, delay])

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} style={{ color }}>{val}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}66, ${color})`
        }}/>
      </div>
    </div>
  )
}
