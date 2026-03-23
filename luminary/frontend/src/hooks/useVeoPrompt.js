import { useState, useRef } from 'react'
import { generateVeoPrompts, generateVeoVideo, checkVeoVideoStatus } from '../api/client'

export function useVeoPrompt() {
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)
  
  // Video specific state
  const [videoJob, setVideoJob] = useState(null)
  const [videoResult, setVideoResult] = useState(null)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const pollInterval = useRef(null)

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current)
      pollInterval.current = null
    }
  }

  const generate = async () => {
    setLoading(true)
    setStatusText("Engineering generation prompts...")
    setResult(null)
    setVideoResult(null)
    setVideoJob(null)
    setGeneratingVideo(false)
    setError('')
    stopPolling()
    
    try {
      const res = await generateVeoPrompts(desc)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Generation failed')
    }
    setLoading(false)
    setStatusText('')
  }
  
  const generateVideo = async (prompt) => {
    if (!prompt) return;
    setGeneratingVideo(true)
    setVideoResult(null)
    setVideoJob(null)
    setError('')
    
    try {
      setStatusText('Initializing Veo 3 video generation...')
      const res = await generateVeoVideo(prompt.slice(0, 1000))
      
      const jobId = res.data.job_id
      setVideoJob(jobId)
      
      // Start polling
      pollInterval.current = setInterval(async () => {
        try {
          const statusRes = await checkVeoVideoStatus(jobId)
          
          if (statusRes.data.status === 'done') {
            stopPolling()
            setVideoResult({
              b64: statusRes.data.video_b64,
              mime: statusRes.data.mime_type
            })
            setGeneratingVideo(false)
            setStatusText('')
          } else if (statusRes.data.status === 'error') {
            stopPolling()
            setError(statusRes.data.error || 'Video generation failed in backend')
            setGeneratingVideo(false)
            setStatusText('')
          } else {
            setStatusText(statusRes.data.progress || 'Rendering video (this takes 2-5 minutes)...')
          }
        } catch (pollErr) {
          // Ignore transient errors, but log them
          if (pollErr.response?.data?.detail === "Job not found") {
            stopPolling()
            setError('Generation job lost')
            setGeneratingVideo(false)
            setStatusText('')
          }
        }
      }, 3000)
      
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to start video generation')
      setGeneratingVideo(false)
      setStatusText('')
    }
  }

  const copyPrompt = (platform, text) => {
    navigator.clipboard.writeText(text)
    setCopied(platform)
    setTimeout(() => setCopied(null), 2000)
  }

  return { desc, setDesc, loading, statusText, result, error, copied, generate, copyPrompt, generateVideo, generatingVideo, videoResult }
}
