import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { withRetry } from '@/lib/audioAnalysis'

// Check environment variables
const requiredEnvVars = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}

// Debug logging for environment setup
console.log('API Environment Check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  keyLength: process.env.OPENAI_API_KEY?.length || 0,
  keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 3),
})

// Validate environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`)
  }
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim() || ''
})

const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 3
const RETRY_DELAY = Number(process.env.RETRY_DELAY) || 1000

export async function POST(request: Request) {
  try {
    console.log('Transcribe API: Starting request processing')

    // Check API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('Transcribe API: OpenAI API key missing')
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set the OPENAI_API_KEY environment variable'
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const audioBlob = formData.get('audio') as Blob

    if (!audioBlob) {
      console.error('Transcribe API: No audio blob provided')
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Log audio blob details for debugging
    console.log('Transcribe API: Audio blob details:', {
      size: audioBlob.size,
      type: audioBlob.type,
      hasContent: audioBlob.size > 0
    })

    // Convert Blob to File
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type })
    console.log('Transcribe API: Created audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    })

    console.log('Transcribe API: Starting OpenAI transcription')
    const transcribeWithRetry = () => openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
      temperature: 0.2,
    })

    const response = await withRetry(
      transcribeWithRetry,
      MAX_RETRIES,
      RETRY_DELAY
    )

    console.log('Transcribe API: Successfully transcribed audio')
    return NextResponse.json({
      text: response.text,
      success: true
    })
  } catch (error: any) {
    console.error('Transcribe API Error:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
      response: error.response?.data,
    })
    
    // More detailed error response
    const errorMessage = error.message || 'Unknown error'
    const errorDetails = error.response?.data || error.cause || error.stack || 'No additional details'
    
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 