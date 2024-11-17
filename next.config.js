/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
        'node:async_hooks': false
      }
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'three-mesh-bvh': false
    }

    return config
  },
  transpilePackages: [
    '@radix-ui/react-progress',
    '@radix-ui/react-primitive',
    'three'
  ],
  async headers() {
    return [
      {
        source: '/api-docs',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig