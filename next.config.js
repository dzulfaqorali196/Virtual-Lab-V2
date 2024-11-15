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
  // Menambahkan konfigurasi untuk API docs
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/api-docs',
        permanent: true,
      },
    ]
  },
  // Menambahkan rewrite untuk API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'  // Tidak perlu menambahkan /route
      }
    ]
  },
  // Konfigurasi untuk swagger-ui-react
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    config.externals = [...(config.externals || []), 'mongoose']
    
    // Tambahkan alias untuk three-mesh-bvh
    config.resolve.alias = {
      ...config.resolve.alias,
      'three-mesh-bvh': require.resolve('three-mesh-bvh'),
      'input-otp': require.resolve('input-otp')
    }
    
    // Tambahkan rule untuk input-otp
    config.module.rules.push({
      test: /input-otp/,
      use: 'null-loader'
    })

    return config
  },
  // Tambahkan transpilePackages
  transpilePackages: ['three-mesh-bvh', 'input-otp'],
  reactStrictMode: true
}

module.exports = nextConfig