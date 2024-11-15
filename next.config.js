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
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Hapus semua externals
    config.externals = []
    
    // Hapus alias yang tidak perlu
    config.resolve.alias = {
      ...config.resolve.alias
    }

    return config
  },
  // Sederhanakan transpilePackages
  transpilePackages: [
    '@radix-ui/react-progress',
    '@radix-ui/react-primitive'
  ],
  reactStrictMode: true
}

module.exports = nextConfig