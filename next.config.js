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
    // In production, route through Netlify functions
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          destination: '/.netlify/functions/nextjs-server/api/:path*'
        }
      ]
    }
    // In development, use Next.js API routes directly
    return []
  },
  // Production-specific settings
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'standalone',
    distDir: '.next',
    generateBuildId: async () => {
      return 'build-' + Date.now()
    }
  } : {})
}

module.exports = nextConfig 