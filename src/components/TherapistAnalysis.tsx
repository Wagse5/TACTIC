'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Play, Pause, Loader2, Volume2 } from 'lucide-react'

interface TherapistAnalysisProps {
  analysis: string
  isVisible: boolean
}

export default function TherapistAnalysis({ analysis, isVisible }: TherapistAnalysisProps) {
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  // Don't try to extract from object anymore, just use the string directly
  const responseText = analysis || ''

  const convertToSpeech = async () => {
    if (!responseText) {
      setError('No response text available')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: responseText })
      })

      if (!response.ok) {
        throw new Error('Failed to convert text to speech')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // Pre-load the audio
      if (audioRef.current) {
        audioRef.current.load()
      }
    } catch (error) {
      console.error('Error converting to speech:', error)
      setError('Failed to load audio. Click to try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayback = async () => {
    if (!audioUrl && !isLoading) {
      await convertToSpeech()
      return
    }

    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error('Playback error:', error)
        setError('Playback failed. Click to try again.')
      }
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  if (!isVisible || !responseText) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6 bg-purple-50">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Therapist's Response</h3>
        </div>
        
        {/* Response Text */}
        <div className="text-purple-800 leading-relaxed text-lg mb-6">
          {responseText}
        </div>
        
        {/* Audio Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 
                     text-white rounded-lg transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Converting to speech...</span>
              </>
            ) : error ? (
              <>
                <Volume2 className="w-5 h-5" />
                <span>{error}</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Response</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Listen to Response</span>
              </>
            )}
          </button>

          {/* Audio Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              onEnded={handleAudioEnd}
              controls
              className="w-full max-w-md"
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </motion.div>
  )
} 