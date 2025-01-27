import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { withRetry } from '@/lib/audioAnalysis'

// Debug logging for environment setup
console.log('\n🔧 API Environment Check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  keyLength: process.env.OPENAI_API_KEY?.length || 0,
  keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 3),
  nodeEnv: process.env.NODE_ENV,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim() || ''
})

const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 3
const RETRY_DELAY = Number(process.env.RETRY_DELAY) || 1000

// Helper function to log blob/file details
const logFileDetails = (prefix: string, file: Blob | File) => {
  const details = {
    type: file.type,
    size: file.size,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
    name: file instanceof File ? file.name : 'blob',
    lastModified: file instanceof File ? new Date(file.lastModified).toISOString() : undefined,
    isFile: file instanceof File,
  }
  console.log(`${prefix}:`, details)
  return details
}

export async function POST(request: Request) {
  console.log('\n🎤 Transcribe API: Starting new request', new Date().toISOString())
  
  try {
    // 1. Environment Check
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Transcribe API: OpenAI API key missing')
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set the OPENAI_API_KEY environment variable'
        },
        { status: 500 }
      )
    }

    // 2. Request Parsing
    console.log('📦 Transcribe API: Parsing request body...')
    const formData = await request.formData()
    const audioBlob = formData.get('audio') as Blob

    if (!audioBlob) {
      console.error('❌ Transcribe API: No audio blob in request')
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // 3. Audio Validation
    const blobDetails = logFileDetails('📊 Audio Blob Details', audioBlob)

    if (!audioBlob.type.startsWith('audio/')) {
      console.error(`❌ Transcribe API: Invalid audio type: ${audioBlob.type}`)
      return NextResponse.json(
        { 
          error: 'Invalid audio format',
          details: `Expected audio/*, got ${audioBlob.type}`,
          receivedFile: blobDetails
        },
        { status: 400 }
      )
    }

    if (audioBlob.size === 0) {
      console.error('❌ Transcribe API: Empty audio file')
      return NextResponse.json(
        { 
          error: 'Empty audio file',
          details: 'The audio file has no content',
          receivedFile: blobDetails
        },
        { status: 400 }
      )
    }

    // 4. File Creation
    console.log('📝 Transcribe API: Converting blob to file...')
    const extension = audioBlob.type.split('/')[1] || 'webm'
    const audioFile = new File([audioBlob], `audio-${Date.now()}.${extension}`, { 
      type: audioBlob.type,
      lastModified: Date.now()
    })

    const fileDetails = logFileDetails('📊 Audio File Details', audioFile)

    // 5. OpenAI Transcription
    console.log('🔄 Transcribe API: Starting OpenAI transcription...')
    const transcribeWithRetry = async () => {
      try {
        console.log('📡 Sending request to OpenAI...')
        const result = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
          language: 'en',
          response_format: 'json',
          temperature: 0.2,
        })
        console.log('✅ OpenAI response received:', {
          hasText: !!result.text,
          textLength: result.text?.length,
          textPreview: result.text?.substring(0, 50) + '...'
        })
        return result
      } catch (error: any) {
        console.error('❌ OpenAI API Error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        })
        throw error
      }
    }

    // 6. Retry Logic
    console.log(`🔄 Starting transcription with ${MAX_RETRIES} max retries...`)
    const response = await withRetry(
      transcribeWithRetry,
      MAX_RETRIES,
      RETRY_DELAY
    )

    // 7. Success Response
    console.log('✅ Transcribe API: Successfully transcribed audio')
    return NextResponse.json({
      text: response.text,
      success: true,
      fileInfo: fileDetails
    })

  } catch (error: any) {
    // 8. Error Handling
    console.error('❌ Transcribe API Error:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        message: error.message || 'Unknown error',
        details: error.response?.data || error.cause || error.stack || 'No additional details',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 