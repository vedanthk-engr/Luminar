import { useState } from 'react'
import { analyzeScript } from '../api/client'

export function useScriptAlchemist() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await analyzeScript(text)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Analysis failed')
    }
    setLoading(false)
  }

  return { text, setText, loading, result, error, analyze }
}
