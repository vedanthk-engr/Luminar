import { useState } from 'react'
import { sendChatMessage } from '../api/client'

export function useCineChat() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Welcome to CineChat. How can I assist you in your cinematic journey today?' }
  ])
  const [inp, setInp] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async (textOveride = null) => {
    const textToSend = textOveride || inp
    if (!textToSend.trim()) return

    const userMsg = { role: 'user', content: textToSend }
    const newHistory = [...msgs, userMsg]
    setMsgs(newHistory)
    setInp('')
    setLoading(true)

    try {
      const res = await sendChatMessage(newHistory)
      setMsgs([...newHistory, { role: 'assistant', content: res.data.reply }])
    } catch (e) {
      console.error(e)
      setMsgs([...newHistory, { role: 'assistant', content: 'CineChat is temporarily unavailable. Please try again.' }])
    }
    setLoading(false)
  }

  return { msgs, inp, setInp, loading, send }
}
