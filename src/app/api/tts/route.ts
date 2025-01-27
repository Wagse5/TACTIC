import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Using a neutral voice
      input: text,
    })

    // Convert the raw response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Return the audio as a response with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to convert text to speech' },
      { status: 500 }
    )
  }
} 