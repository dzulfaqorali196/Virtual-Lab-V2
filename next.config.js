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
    // Konfigurasi untuk node:async_hooks
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
    
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /node_modules\/mongodb/,
          use: 'null-loader',
        }
      ]
    }

    return config
  },
  transpilePackages: [
    '@radix-ui/react-progress',
    '@radix-ui/react-primitive'
  ]
}

module.exports = nextConfig