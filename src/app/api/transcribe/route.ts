import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { withRetry } from '@/lib/audioAnalysis'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY.trim()
})

const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 3
const RETRY_DELAY = Number(process.env.RETRY_DELAY) || 1000

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as Blob

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({
      text: response.text,
      success: true
    })
  } catch (error: any) {
    console.error('Transcription error:', error.message || error)
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
} 