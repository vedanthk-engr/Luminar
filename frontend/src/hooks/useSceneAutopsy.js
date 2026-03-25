import { useState } from 'react'
import { analyzeSceneImage, analyzeSceneText } from '../api/client'

export function useSceneAutopsy() {
  const [mode, setMode] = useState('upload')     // 'upload' | 'describe'
  const [img, setImg] = useState(null)           // File object
  const [preview, setPreview] = useState(null)   // Object URL
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImg(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  const clearImage = () => {
    setImg(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      let res
      if (mode === 'upload' && img) {
        const formData = new FormData()
        formData.append('file', img)
        res = await analyzeSceneImage(formData)
      } else {
        res = await analyzeSceneText(desc)
      }
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Analysis failed')
    }
    setLoading(false)
  }

  const canSubmit = mode === 'upload' ? !!img : !!desc.trim()

  return { mode, setMode, img, preview, desc, setDesc, loading, result, error, handleFile, clearImage, analyze, canSubmit }
}
