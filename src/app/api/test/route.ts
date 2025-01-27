import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV || 'not set',
    openai: process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing',
    deepseek: process.env.DEEPSEEK_API_KEY ? 'Loaded' : 'Missing',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'not set',
    debug: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false'
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
} 