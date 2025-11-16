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
  }
}

module.exports = nextConfig