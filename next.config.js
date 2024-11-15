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
    
    // Hapus mongoose dari externals
    config.externals = config.externals.filter(external => external !== 'mongoose')
    
    // Tambahkan alias untuk three dan three-mesh-bvh
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
      'three-mesh-bvh': false // Disable three-mesh-bvh
    }

    return config
  },
  // Tambahkan semua packages yang perlu ditranspile
  transpilePackages: [
    'input-otp',
    '@radix-ui/react-progress',
    '@radix-ui/react-primitive'
  ],
  reactStrictMode: true
}

module.exports = nextConfig