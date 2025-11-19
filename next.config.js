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
  // Webpack configuration for better chunk handling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            clerk: {
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              name: 'clerk',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig