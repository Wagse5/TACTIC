/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/.netlify/functions/server/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 