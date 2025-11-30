/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Temporarily disable optimization to ensure all images load
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'ik.imagekit.io',
      'shopwave.b-cdn.net',
      'images.unsplash.com',
      'via.placeholder.com',
      'deodap.in'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '**.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Add experimental features for better error handling
  experimental: {
    optimizePackageImports: ['@clerk/nextjs'],
  },
  // Simplified security headers for better performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig