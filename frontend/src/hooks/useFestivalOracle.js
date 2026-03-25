import { useState } from 'react'
import { getFestivalStrategy } from '../api/client'

export function useFestivalOracle() {
  const initialForm = {
    title: '', genre: '', runtime: '', country: '', language: '', budget: '', synopsis: ''
  }
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  
  const loadSample = (sample) => setForm(sample)

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await getFestivalStrategy(form)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Strategy generation failed')
    }
    setLoading(false)
  }

  return { form, updateForm, loadSample, loading, result, error, analyze }
}
