import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
})

// Scene Autopsy
export const analyzeSceneImage = (formData) =>
  client.post('/api/scene/analyze/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const analyzeSceneText = (description) =>
  client.post('/api/scene/analyze/text', { description })

// Script Alchemist
export const analyzeScript = (text) =>
  client.post('/api/script/analyze', { text })

// Shot Composer
export const composeShots = (description) =>
  client.post('/api/shots/compose', { description })

// VeoPrompt Studio
export const generateVeoPrompts = (description) =>
  client.post('/api/veo/generate', { description })

export const generateVeoVideo = (prompt, duration = 4, aspect_ratio = "16:9") =>
  client.post('/api/veo/generate-video', { prompt, duration, aspect_ratio })

export const checkVeoVideoStatus = (jobId) =>
  client.get(`/api/veo/status/${jobId}`)

// Festival Oracle
export const getFestivalStrategy = (formData) =>
  client.post('/api/festival/strategy', formData)

// CineAccess
export const generateAccessibility = (scene, mode) =>
  client.post('/api/access/generate', { scene, mode })

// CineChat
export const sendChatMessage = (history) =>
  client.post('/api/chat/message', { history })

export default client
