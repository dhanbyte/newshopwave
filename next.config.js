/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'ik.imagekit.io',
      'shopwave.b-cdn.net', 
      'images.unsplash.com',
      'via.placeholder.com',
      'deodap.in'
    ]
  },
  // Add experimental features for better error handling
  experimental: {
    optimizePackageImports: ['@clerk/nextjs'],
  },
}

module.exports = nextConfig