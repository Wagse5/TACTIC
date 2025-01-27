import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('🔍 Test API Route Called:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString()
  })

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    openai: process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing',
    deepseek: process.env.DEEPSEEK_API_KEY ? 'Loaded' : 'Missing',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'not set',
    debug: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false',
    request: {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers)
    }
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json'
    }
  })
} 