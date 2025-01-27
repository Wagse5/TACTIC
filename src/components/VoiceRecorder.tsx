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
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      setError(null)

      // Set timeout for max recording duration
      recordingTimeout.current = setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording()
        }
      }, MAX_RECORDING_TIME)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
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
            Stop Recording ({Math.floor((MAX_RECORDING_TIME - Date.now()) / 1000)}s)
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