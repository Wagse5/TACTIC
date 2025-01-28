// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['tactially.netlify.app', 'localhost:3000']
    }
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/.netlify/functions/server/api/:path*'
          : '/api/:path*',
      }
    ]
  },
  // Only use standalone output in production
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {})
}

module.exports = nextConfig 