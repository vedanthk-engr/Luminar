import { useState } from 'react'
import { generateAccessibility } from '../api/client'

export function useCineAccess() {
  const [mode, setMode] = useState('audio') // audio, cognitive, cultural, sign
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState(null)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setOutput(null)
    setError('')
    try {
      const res = await generateAccessibility(input, mode)
      setOutput(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Generation failed')
    }
    setLoading(false)
  }

  return { mode, setMode, input, setInput, loading, output, error, generate }
}
