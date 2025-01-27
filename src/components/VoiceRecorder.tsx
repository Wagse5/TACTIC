'use client'

import * as React from 'react'
import { Mic, StopCircle, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const MAX_RECORDING_TIME = 30000 // 30 seconds
  const [isRecording, setIsRecording] = React.useState(false)
  const [audioURL, setAudioURL] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const mediaRecorder = React.useRef<MediaRecorder | null>(null)
  const audioChunks = React.useRef<Blob[]>([])
  const recordingTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Use specific MIME type that OpenAI supports
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      console.log('🎤 Started recording with MIME type:', mediaRecorder.current.mimeType)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('📦 Received audio chunk:', {
            size: event.data.size,
            type: event.data.type
          })
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = async () => {
        console.log('🛑 Recording stopped, processing audio...')
        const audioBlob = new Blob(audioChunks.current, { 
          type: mediaRecorder.current?.mimeType || 'audio/webm'
        })
        
        console.log('📊 Final audio blob:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: audioChunks.current.length
        })

        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        
        if (onRecordingComplete) {
          console.log('🔄 Sending audio to parent component')
          onRecordingComplete(audioBlob)
        }
      }

      // Request data every second
      mediaRecorder.current.start(1000)
      setIsRecording(true)
      setError(null)

      // Set timeout for max recording duration
      recordingTimeout.current = setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording()
        }
      }, MAX_RECORDING_TIME)
    } catch (err) {
      console.error('❌ Error starting recording:', err)
      setError('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      console.log('🛑 Stopping recording...')
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current)
      }
    }
    setIsRecording(false)
  }

  React.useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current)
      }
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop()
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [audioURL])

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {audioURL && !isRecording && (
        <div className="flex justify-center">
          <audio src={audioURL} controls className="w-full max-w-md" />
        </div>
      )}
    </div>
  )
} 