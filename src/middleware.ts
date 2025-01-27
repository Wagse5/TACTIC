import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Generate a unique request ID
  const requestId = Math.random().toString(36).substring(7)
  const startTime = Date.now()

  // Log incoming request
  console.log(`\n🌐 [${requestId}] Incoming Request:`, {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    headers: Object.fromEntries(request.headers),
    geo: request.geo,
    ip: request.ip,
    startTime
  })

  try {
    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      console.log(`✨ [${requestId}] Handling OPTIONS request`)
      const response = new NextResponse(null, {
        status: 204,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        }),
      })
      return response
    }

    // Handle regular requests
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Log response
    const endTime = Date.now()
    console.log(`✅ [${requestId}] Response Sent:`, {
      timestamp: new Date().toISOString(),
      duration: `${endTime - startTime}ms`,
      status: response.status,
      headers: Object.fromEntries(response.headers),
      url: request.url
    })

    return response
  } catch (error) {
    // Log error
    console.error(`❌ [${requestId}] Middleware Error:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}

// Only run middleware on API routes and exclude static files
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 