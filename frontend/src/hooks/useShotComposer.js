import { useState } from 'react'
import { composeShots } from '../api/client'

export function useShotComposer() {
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await composeShots(desc)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Composition failed')
    }
    setLoading(false)
  }

  return { desc, setDesc, loading, result, error, generate }
}
