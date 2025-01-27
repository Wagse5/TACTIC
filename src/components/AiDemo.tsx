'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import VoiceRecorder from './VoiceRecorder'
import { Loader2, Play, Pause } from 'lucide-react'

interface AudioMetrics {
  avgAmplitude: number
  maxAmplitude: number
  zeroCrossingRate: number
  variance: number
  pitch: number[]
  formants: number[]
  mfcc: number[]
  spectralCentroid: number
  spectralRolloff: number
  energyEntropy: number
}

interface AnalysisResult {
  primaryEmotion: string
  secondaryEmotion: string
  confidence: number
  details?: string
  therapeuticInsight?: string
}

interface EmotionAnalysis {
  primary: string
  secondary: string
  confidence: number
  therapeuticInsight?: string
}

export default function AiDemo() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [deepSeekResponse, setDeepSeekResponse] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const extractAudioFeatures = async (audioBuffer: AudioBuffer): Promise<AudioMetrics> => {
    const channelData = audioBuffer.getChannelData(0)
    const bufferLength = channelData.length
    
    let sum = 0
    let max = 0
    let crossings = 0
    let lastVal = 0
    let varianceSum = 0
    let mean = 0
    
    // First pass - calculate mean
    for (let i = 0; i < bufferLength; i++) {
      mean += Math.abs(channelData[i])
    }
    mean /= bufferLength
    
    // Second pass - calculate variance and other metrics
    for (let i = 0; i < bufferLength; i++) {
      const amplitude = Math.abs(channelData[i])
      sum += amplitude
      max = Math.max(max, amplitude)
      varianceSum += (amplitude - mean) ** 2
      
      if (lastVal < 0 && channelData[i] > 0 || lastVal > 0 && channelData[i] < 0) {
        crossings++
      }
      lastVal = channelData[i]
    }

    // Calculate basic metrics
    const avgAmplitude = sum / bufferLength
    const variance = varianceSum / bufferLength
    const zeroCrossingRate = crossings / bufferLength

    // Placeholder values for advanced metrics (to be implemented)
    const pitch = [440] // Default A4 pitch
    const formants = [500, 1500, 2500] // Typical formant frequencies
    const mfcc = Array(13).fill(0) // 13 is typical MFCC coefficient count
    
    return {
      avgAmplitude,
      maxAmplitude: max,
      zeroCrossingRate,
      variance,
      pitch,
      formants,
      mfcc,
      spectralCentroid: avgAmplitude * 1000, // Placeholder
      spectralRolloff: max * 1000, // Placeholder
      energyEntropy: variance * 100 // Placeholder
    }
  }

  const performTensorFlowAnalysis = async (metrics: AudioMetrics): Promise<AnalysisResult> => {
    // Local analysis based on audio metrics
    let primaryEmotion = 'Neutral'
    let secondaryEmotion = 'Calm'
    let confidence = 70

    if (metrics.zeroCrossingRate > 0.1) {
      if (metrics.maxAmplitude > 0.8 && metrics.variance > 0.1) {
        primaryEmotion = 'Anger'
        secondaryEmotion = 'Irritability'
        confidence = 85
      } else if (metrics.avgAmplitude > 0.4 && metrics.variance > 0.05) {
        primaryEmotion = 'Anxiety'
        secondaryEmotion = 'Agitation'
        confidence = 80
      } else if (metrics.variance > 0.03) {
        primaryEmotion = 'Depression'
        secondaryEmotion = 'Restlessness'
        confidence = 75
      }
    } else {
      if (metrics.avgAmplitude > 0.6 && metrics.variance < 0.05) {
        primaryEmotion = 'Mania'
        secondaryEmotion = 'Elevated Mood'
        confidence = 82
      } else if (metrics.avgAmplitude < 0.2 && metrics.variance < 0.02) {
        primaryEmotion = 'Depression'
        secondaryEmotion = 'Low Energy'
        confidence = 78
      } else if (metrics.variance < 0.01) {
        primaryEmotion = 'Depression'
        secondaryEmotion = 'Flat Affect'
        confidence = 76
      }
    }

    const result = {
      primaryEmotion,
      secondaryEmotion,
      confidence,
      details: `Analysis based on: ZCR=${metrics.zeroCrossingRate.toFixed(3)}, Amplitude=${metrics.avgAmplitude.toFixed(3)}, Variance=${metrics.variance.toFixed(3)}`
    }
    console.log('TensorFlow Analysis:', { metrics, result })
    return result
  }

  const performDeepSeekAnalysis = async (
    metrics: AudioMetrics,
    transcription: string,
    audioBlob: Blob
  ): Promise<AnalysisResult> => {
    console.log('\n🔍 Starting DeepSeek Analysis on client side...')
    
    // Format the request payload
    const payload = {
      transcription: transcription,
      audioFeatures: {
        avgAmplitude: metrics.avgAmplitude,
        zeroCrossingRate: metrics.zeroCrossingRate,
        variance: metrics.variance,
        maxAmplitude: metrics.maxAmplitude,
        spectralCentroid: metrics.spectralCentroid,
        spectralRolloff: metrics.spectralRolloff,
        energyEntropy: metrics.energyEntropy
      }
    }

    console.log('Sending payload to DeepSeek:', JSON.stringify(payload, null, 2))

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('DeepSeek API Response Status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('DeepSeek API Error:', errorData)
        throw new Error(`API error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('DeepSeek API Response:', data)

      if (data.error) {
        throw new Error(data.error)
      }

      // Extract the therapeutic insight
      const therapeuticInsight = data.analysis?.therapeuticInsight || data.analysis?.fullAnalysis || ''
      console.log('Therapeutic Insight:', therapeuticInsight)

      return {
        primaryEmotion: data.analysis?.primaryEmotion || "Neutral",
        secondaryEmotion: data.analysis?.secondaryEmotion || "Calm",
        confidence: data.analysis?.confidence || 70,
        details: data.analysis?.fullAnalysis || '',
        therapeuticInsight: therapeuticInsight
      }
    } catch (error) {
      console.error('Error in DeepSeek analysis:', error)
      return {
        primaryEmotion: "Error",
        secondaryEmotion: "Analysis Failed",
        confidence: 0,
        details: error instanceof Error ? error.message : "Unknown error occurred",
        therapeuticInsight: "I apologize, but I wasn't able to analyze your response at this moment. Please try again."
      }
    }
  }

  const extractEmotionsFromAnalysis = (analysis: string | AnalysisResult): EmotionAnalysis => {
    try {
      // If analysis is already an object with the expected properties
      if (typeof analysis === 'object' && 'primaryEmotion' in analysis) {
        console.log('Analysis is already parsed:', analysis)
        return {
          primary: analysis.primaryEmotion || "Neutral",
          secondary: analysis.secondaryEmotion || "Calm",
          confidence: analysis.confidence || 70,
          therapeuticInsight: analysis.therapeuticInsight
        }
      }

      // If analysis is a string
      if (typeof analysis === 'string') {
        console.log('Extracting emotions from text:', analysis.substring(0, 100) + '...')
        // Default values
        let primary = "Neutral"
        let secondary = "Calm"
        let confidence = 70

        // Look for explicit mentions of emotions
        const emotionKeywords = {
          primary: ['primary emotion', 'main emotion', 'dominant emotion', 'primary emotional state'],
          secondary: ['secondary emotion', 'additional emotion', 'underlying emotion', 'secondary emotional indicators'],
          confidence: ['confidence', 'certainty', 'reliability', 'confidence level']
        }

        const lines = analysis.split('\n')

        // Extract primary emotion
        for (const line of lines) {
          const lowerLine = line.toLowerCase()
          // Primary emotion
          for (const keyword of emotionKeywords.primary) {
            if (lowerLine.includes(keyword)) {
              const match = line.match(/[:**]\s*([^.,\n]*)/i)
              if (match && match[1]) {
                primary = match[1].trim()
                break
              }
            }
          }
          // Secondary emotion
          for (const keyword of emotionKeywords.secondary) {
            if (lowerLine.includes(keyword)) {
              const match = line.match(/[:**]\s*([^.,\n]*)/i)
              if (match && match[1]) {
                secondary = match[1].trim()
                break
              }
            }
          }
          // Confidence
          for (const keyword of emotionKeywords.confidence) {
            if (lowerLine.includes(keyword)) {
              const match = line.match(/(\d+)%?/i)
              if (match && match[1]) {
                confidence = parseInt(match[1])
                break
              }
            }
          }
        }

        return {
          primary,
          secondary,
          confidence,
          therapeuticInsight: analysis
        }
      }

      // If neither string nor valid object, return default values
      return {
        primary: "Neutral",
        secondary: "Calm",
        confidence: 70,
        therapeuticInsight: "Unable to analyze the response."
      }
    } catch (error) {
      console.error('Error extracting emotions:', error)
      return {
        primary: "Error",
        secondary: "Analysis Failed",
        confidence: 0,
        therapeuticInsight: "An error occurred while analyzing the response."
      }
    }
  }

  const convertToSpeech = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error('Failed to convert text to speech')

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // Pre-load the audio
      if (audioRef.current) {
        audioRef.current.load()
      }
    } catch (error) {
      console.error('Error converting to speech:', error)
    }
  }

  const togglePlayback = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsLoading(true)
    console.log('🎤 Starting audio analysis...')

    try {
      // Step 1: Transcribe audio
      console.log('Step 1: Transcribing audio with Whisper...')
      const formData = new FormData()
      formData.append('audio', audioBlob)
      
      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const transcriptionData = await transcriptionResponse.json()
      console.log('📝 Transcription result:', transcriptionData)
      const transcription = transcriptionData.text || ''

      // Step 2: Extract audio features
      console.log('Step 2: Extracting audio features...')
      const audioContext = new AudioContext()
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const metrics = await extractAudioFeatures(audioBuffer)
      console.log('🎵 Extracted audio features:', metrics)

      // Step 3: Perform DeepSeek analysis
      console.log('Step 3: Sending to DeepSeek for analysis...')
      const deepSeekResult = await performDeepSeekAnalysis(metrics, transcription, audioBlob)
      console.log('🤖 DeepSeek analysis result:', deepSeekResult)

      // Store the therapeutic response and prepare audio
      if (deepSeekResult.therapeuticInsight) {
        setDeepSeekResponse(deepSeekResult.therapeuticInsight)
        await convertToSpeech(deepSeekResult.therapeuticInsight)
      }
    } catch (err) {
      console.error('Error in analysis:', err)
      setDeepSeekResponse('I apologize, but I encountered an error while analyzing your audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Voice Analysis
          </motion.h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <VoiceRecorder onRecordingComplete={analyzeAudio} />

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex items-center justify-center gap-2 text-gray-600"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing voice...</span>
            </motion.div>
          )}

          {!isLoading && deepSeekResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex flex-col items-center"
            >
              <button
                onClick={togglePlayback}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 
                         text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                disabled={!audioUrl}
              >
                {isPlaying ? (
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

              <audio
                ref={audioRef}
                src={audioUrl || ''}
                onEnded={handleAudioEnd}
                className="hidden"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
} 