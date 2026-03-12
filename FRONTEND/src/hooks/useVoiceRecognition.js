import { useState, useRef, useCallback } from 'react'

export function useVoiceRecognition() {
  const [transcript, setTranscript]   = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isEnabled, setIsEnabled]     = useState(false)
  const [error, setError]             = useState(null)
  const recognitionRef                = useRef(null)

  const getSpeechRecognition = () =>
    window.SpeechRecognition || window.webkitSpeechRecognition

  const enableVoice = useCallback(() => {
    const SR = getSpeechRecognition()
    if (!SR) {
      setError('Speech Recognition is not supported in this browser. Please use Chrome.')
      return
    }
    setIsEnabled(true)
    setError(null)
  }, [])

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition()
    if (!SR || !isEnabled) return

    setError(null)
    setTranscript('')

    const recognition = new SR()
    recognition.lang              = 'ta-IN'
    recognition.continuous        = true
    recognition.interimResults    = true
    recognition.maxAlternatives   = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let final    = ''
      let interim  = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) final  += text + ' '
        else                           interim += text
      }
      setTranscript((prev) => {
        // Keep finalized transcripts, show interim at the end
        const base = prev.replace(/‥.*$/, '').trimEnd()
        if (final)   return (base + ' ' + final).trim()
        if (interim) return (base + ' ‥' + interim).trim()
        return prev
      })
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setError(`Voice error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [isEnabled])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
    // Clean up interim markers
    setTranscript(t => t.replace(/\s*‥.*$/, '').trim())
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  const disableVoice = useCallback(() => {
    stopListening()
    setIsEnabled(false)
    setTranscript('')
    setError(null)
  }, [stopListening])

  return {
    transcript,
    isListening,
    isEnabled,
    error,
    enableVoice,
    startListening,
    stopListening,
    resetTranscript,
    disableVoice,
    setTranscript,
  }
}
